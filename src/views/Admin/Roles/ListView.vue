<template>
	<loading-elem v-if="loadingContent"></loading-elem>

	<template v-else>
		<actions-bar bar-title="Funções" :action-button-create="{
			show: true,
			disabled: !$permission.addResource('role').canCreate(),
			text: 'Nova função',
			icon: 'mdi-shield-plus-outline',
			to: { name: 'admin.roles.create' },
		}"></actions-bar>

		<list-group-elem @changePage="methodChangePage" resource="role" :items="roles.list" :pages="roles.pages"
			v-slot="{ item }" :action-edit="methodEdit" :action-delete="methodDeleteConfirmed"
			action-delete-dialog-title="Excluir esta função?"
			action-delete-dialog-text="A exclusão desta função será definitiva e não poderá ser desfeita."
			:action-filter="methodFilter">

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
	</template>
</template>

<script>

import axios from '@/plugins/axios.js';
import alert from '@/services/alert.js';
import LoadingElem from '@/components/LoadingElem.vue';
import ActionsBar from '@/layouts/default/ActionsBar.vue';
import ListGroupElem from '@/components/ListGroupElem.vue';

export default {
	components: { LoadingElem, ActionsBar, ListGroupElem },
	data() {
		return {
			loadingContent: true,
			roles: {
				limit: 10,
				list: [],
				pages: []
			}
		};
	},
	created() {
		this.methodMain();
	},
	methods: {
		methodMain() {
			this.$util.app.breadcrumbs([
				{
					text: 'Funções',
					to: { name: 'admin.roles' },
					disabled: true
				}
			]);

			this.methodGetRoles(1);
		},
		methodChangePage(page) {
			return this.methodGetRoles(page.page);
		},
		methodGetRoles(page, search = null) {
			let action = '/admin/roles?page=' + page + '&limit=' + this.roles.limit + (search ? '&search=' + search : '');

			return axios.req({
				action: action,
				method: 'get',
				success: (resp) => {
					this.roles.list = resp.data.roles.list;
					this.roles.pages = resp.data.roles.meta.links;
				},
				finally: () => {
					this.loadingContent = false;
				}
			});
		},
		methodEdit(event) {
			let id = event.target.getAttribute('data-identificator');
			this.$router.push({ name: 'admin.roles.edit', params: { role_id: id } });
		},
		methodDeleteConfirmed(event) {
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
		methodFilter(event) {
			return this.methodGetRoles(1, event.search);
		}
	}
}

</script>