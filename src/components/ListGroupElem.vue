<template>
	<v-row v-if="actionFilter">
		<v-col></v-col>
		<v-col cols="12" md="4" lg="3">
			<v-form @submit.prevent="method_filter">
				<v-text-field v-model="filter.form.search" append-inner-icon="mdi-magnify" label="Buscar por..." type="text"
					density="compact" variant="outlined" clear-icon="mdi-close-circle" clearable
					@click:append-inner="method_filter" @click:clear="method_clearFilterField"
					:loading="filter.form.submitting" :readonly="filter.form.submitting"></v-text-field>
			</v-form>
		</v-col>
	</v-row>
	<div v-if="listItems.length">
		<v-table density="compact" class="bg-transparent rounded">
			<thead>
				<tr>
					<th class="d-none d-md-table-cell">ID</th>
					<th>Informações</th>
					<th v-if="computed_hasAction">Ações</th>
				</tr>
			</thead>
			<tbody style="position: relative;">
				<div v-if="loadingList"
					:class="[$utils.app.config.isDarkMode() ? 'dark-loading-list-background' : 'light-loading-list-background']"
					style="position: absolute; bottom: 0; right: 0; width: 100%; height: 100%; z-index: 1000;">
					<div class="d-flex justify-center align-center w-100 h-100">
						<loading-elem></loading-elem>
					</div>
				</div>

				<tr v-for="item, index in items" :key="index">
					<td v-if="item?.id" class="text-right d-none d-md-table-cell">
						{{ item.id }}
					</td>
					<td class="w-100 py-6">
						<slot :item="item" :index="index" />
					</td>
					<td v-if="computed_hasAction">
						<v-btn-group density="compact">
							<!-- actions button -->
							<v-btn v-if="actionShow" @click.stop="method_showItem" text="Ver" prepend-icon="mdi-eye-outline"
								size="small" color="secondary" :data-identificator="item?.id ?? index"
								:disabled="!$permissions.addResource(this.resource).canView()" />
							<v-btn v-if="actionEdit" @click.stop="method_editItem" text="Editar"
								prepend-icon="mdi-square-edit-outline" size="small" color="primary"
								:data-identificator="item?.id ?? index"
								:disabled="!$permissions.addResource(this.resource).canUpdate()" />
							<confirmation-button v-if="actionDelete" text="Excluir" icon="mdi-delete-outline" size="small"
								color="danger" :dialog-title="actionDeleteDialogTitle ?? 'Confirmar exclusão?'"
								:dialog-text="actionDeleteDialogText" :data-identificator="item?.id ?? index"
								:confirm-callback="computed_getConfirmCallback" :confirm-route="computed_getConfirmRoute"
								variant="outlined" :disabled="!$permissions.addResource(this.resource).canDelete()" />
							<!-- /actions button -->
						</v-btn-group>
					</td>
				</tr>

			</tbody>
		</v-table>

		<v-pagination v-if="listPages.length && listPages.length - 2 > 1" :length="listPages.length - 2" :total-visible="5"
			@update:model-value="method_paginationUpdateModelValue"></v-pagination>
	</div>
	<v-card v-else>
		<v-card-text>
			<p class="text-h7 text-lg-h6 text-center text-grey-darken-1">
				{{ computed_emptyListText }}
			</p>
		</v-card-text>
	</v-card>
</template>

<script>

import ConfirmationButton from './ConfirmationButton.vue';
import LoadingElem from './LoadingElem.vue';

export default {
	components: { ConfirmationButton, LoadingElem },
	data() {
		return {
			filter: {
				filter: false,
				form: {
					search: null,
					submitting: false
				}
			},
			listItems: [],
			listPages: [],
			loadingList: false
		};
	},
	emits: {
		'changePage': null
	},
	props: {
		emptyListText: {
			type: String,
			default: null
		},
		/**
		 * A valid resource unique name. Check the 'resources' const array on /services/permissions.js
		 */
		resource: {
			type: [String, null],
			default: null
		},
		items: {
			type: Array,
			default: Array
		},
		pages: {
			type: Array,
			default: Array
		},
		actionShow: {
			type: [String, Object, Function],
			default: null
		},
		actionEdit: {
			type: [String, Object, Function],
			default: null
		},
		actionDelete: {
			type: [String, Object, Function],
			default: null
		},
		actionDeleteDialogTitle: {
			type: String,
			default: null
		},
		actionDeleteDialogText: {
			type: String,
			default: null
		},
		actionFilter: {
			type: [Function],
			default: null
		}
	},
	watch: {
		items: {
			deep: true,
			immediate: true,
			handler(nv) {
				this.listItems = nv;
				if (this.loadingList) {
					this.loadingList = false;
				}
			}
		},
		pages: {
			deep: true,
			immediate: true,
			handler(nv) {
				this.listPages = nv;
			}
		}
	},
	computed: {
		computed_emptyListText() {
			return this.emptyListText ?? "Lista vazia";
		},
		computed_hasAction() {
			return this.actionShow || this.actionEdit || this.actionDelete;
		},
		computed_getConfirmCallback() {
			return typeof this.actionDelete === 'function' ? this.actionDelete : null;
		},
		computed_getConfirmRoute() {
			return typeof this.actionDelete === 'object' ? this.actionDelete : null;
		}
	},
	methods: {
		method_showItem(event) {
			this.method_call(this.actionShow, event);
		},
		method_editItem(event) {
			this.method_call(this.actionEdit, event);
		},
		method_call(action, event) {
			switch (typeof action) {
				case 'function':
					action(event);
					break;
				case 'object':
					this.$router.push(action);
					break;
				case 'string':
					window.location.href = action
					break;
			}
		},
		method_paginationUpdateModelValue(currentPage) {
			this.loadingList = true;
			this.$emit('changePage', { page: currentPage, url: this.listPages[currentPage] });
		},
		method_filter() {
			if (!this.actionFilter) {
				return;
			}

			this.filter.form.submitting = true;
			if (typeof this.actionFilter == 'function') {
				let callback = this.actionFilter(this.filter.form);

				try {
					callback.finally(() => {
						this.filter.form.submitting = false;
					});
				} catch (e) {
					this.filter.form.submitting = false;
				}
			}
		},
		method_clearFilterField() {
			this.method_filter();
		}
	}
}

</script>

<style scoped>
.dark-loading-list-background {
	background-color: rgba(35, 35, 35, 0.75);
}

.light-loading-list-background {
	background-color: rgba(246, 246, 246, 0.75);
}
</style>