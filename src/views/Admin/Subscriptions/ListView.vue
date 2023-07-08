<template>
	<loading-elem v-if="loadingContent"></loading-elem>

	<template v-else>
		<actions-bar bar-title="Assinaturas"></actions-bar>

		<list-group-elem @changePage="methodChangePage" :items="subscriptions.list" :pages="subscriptions.pages"
			v-slot="{ item }" :action-show="methodShow" :action-filter="methodFilter">

			<v-row>
				<v-col cols="12" sm="8" md="4" lg="3">
					<p class="text-subtitle-2 font-weight-light">Pacote</p>
					<p>{{ item.package_metadata.name }}</p>
				</v-col>
				<v-col cols="12" sm="8" md="4" lg="3">
					<p class="text-subtitle-2 font-weight-light">Status</p>
					<v-chip :color="{
						active: 'success',
						pending: 'info',
						canceled: 'danger',
						ended: 'warning'
					}[item.status]">
						{{ {
							active: 'Ativo',
							pending: 'Pendente',
							canceled: 'Cancelado',
							ended: 'Finalizdao'
						}[item.status] }}
					</v-chip>
					<p></p>
				</v-col>
			</v-row>

		</list-group-elem>
	</template>
</template>

<script>

import { useAppStore } from '@/store/app';
import axios from '@/plugins/axios.js';
import LoadingElem from '@/components/LoadingElem.vue';
import ActionsBar from '@/layouts/default/ActionsBar.vue';
import ListGroupElem from '@/components/ListGroupElem.vue';

export default {
	components: { LoadingElem, ActionsBar, ListGroupElem },
	data() {
		return {
			loadingContent: true,
			subscriptions: {
				limit: 10,
				list: [],
				pages: []
			}
		};
	},
	created() {
		useAppStore().updateBreadcrumbs([
			{
				text: 'Home',
				to: { name: 'admin.home' },
				disabled: false
			},
			{
				text: 'Assinaturas',
				to: { name: 'admin.subscriptions' },
				disabled: true
			}
		]);

		this.methodGetSubscriptions(1);
	},
	methods: {
		methodChangePage(page) {
			return this.methodGetSubscriptions(page.page);
		},
		methodGetSubscriptions(page, search = null) {
			let action = '/admin/subscriptions?page=' + page + '&limit=' + this.subscriptions.limit + (search ? '&search=' + search : '');

			return axios.req({
				action: action,
				method: 'get',
				success: (resp) => {
					this.subscriptions.list = resp.data.subscriptions.list;
					this.subscriptions.pages = resp.data.subscriptions.meta.links;
				},
				finally: () => {
					this.loadingContent = false;
				}
			});
		},
		methodFilter(event) {
			return this.methodGetSubscriptions(1, event.search);
		},
		methodShow(event) {
			this.$router.push({ name: 'admin.subscriptions.show', params: { subscription_id: event.target.getAttribute('data-identificator') } });
		}
	}
}

</script>