<template>
	<base-view :load-contents="[
		method_getRoles
	]" bar-title="Funções" :bar-create-button="{
	show: computed_userStore.permission('role').canCreate(),
	text: 'Nova função',
	icon: 'mdi-shield-plus-outline',
	to: { name: 'admin.roles.create' },
}">

		<list-group-elem @changePage="method_changePage" resource="role" :items="roles.list" :pages="roles.pages"
			v-slot="{ item }" :action-edit="method_edit" :action-delete="method_deleteConfirmed"
			action-delete-dialog-title="Excluir esta função?"
			action-delete-dialog-text="A exclusão desta função será definitiva e não poderá ser desfeita."
			:action-filter="method_filter">

			<v-row>
				<v-col cols="12" sm="8" md="4" lg="3">
					<p class="text-subtitle-2 font-weight-light">Nome da função</p>
					<p class="font-weight-medium">{{ item.display_name }}</p>
					<p></p>
				</v-col>
				<v-col cols="12" sm="4" md="3">
					<p class="text-subtitle-2 font-weight-light">Nome único</p>
					<p class="font-weight-medium">{{ item.name }}</p>
					<p></p>
				</v-col>
			</v-row>

		</list-group-elem>

	</base-view>
</template>

<script>

import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import axios from '@/plugins/axios.js';
import alert from '@/services/alert.js';
import ListGroupElem from '@/components/ListGroupElem.vue';
import BaseView from '@/views/BaseView.vue';

export default {
	components: { ListGroupElem, BaseView },
	data() {
		return {
			roles: {
				limit: 10,
				list: [],
				pages: []
			}
		};
	},
	created() {
		this.method_main();
	},
	methods: {
		method_main() {
			this.computed_appStore.updateBreadcrumbs([
				{
					text: 'Funções',
					to: { name: 'admin.roles' },
					disabled: true
				}
			]);
		},
		method_changePage(page) {
			return this.method_getRoles(page.page);
		},
		method_getRoles(page = 1, search = null) {
			let action = '/admin/roles?page=' + page + '&limit=' + this.roles.limit + (search ? '&search=' + search : '');

			return axios.req({
				action: action,
				method: 'get',
				success: (resp) => {
					this.roles.list = resp.data.roles.list;
					this.roles.pages = resp.data.roles.meta.links;
				}
			});
		},
		method_edit(event) {
			let id = event.target.getAttribute('data-identificator');
			this.$router.push({ name: 'admin.roles.edit', params: { role_id: id } });
		},
		method_deleteConfirmed(event) {
			let id = event.target.getAttribute('data-identificator');

			return axios.req({
				action: '/admin/roles/' + id,
				method: 'delete',
				success: () => {
					alert.add('Função excluída com sucesso!',
						'warning',
						'Excluída!',
						null,
						false
					);

					this.roles.list.splice(this.roles.list.findIndex((role) => role.id == id), 1);
				}
			});
		},
		method_filter(event) {
			return this.method_getRoles(1, event.search);
		}
	},
	computed: {
		computed_appStore() {
			return useAppStore();
		},
		computed_userStore() {
			return useUserStore();
		}
	}
}

</script>