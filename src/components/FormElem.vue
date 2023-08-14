<template>
    <v-form v-model="valid">
        <v-row>
            <template v-for="field, key in fields" :key="key">
                <v-col cols="12" :sm="field?.sizes?.sm" :md="field?.sizes?.md" :lg="field?.sizes?.lg"
                    :xl="field?.sizes?.xl">
                    <template v-if="field.type == 'group'">
                        <div class="mb-5">
                            <h6 class="text-h6">{{ field.label }}</h6>
                            <tiny-text-elem :text="field.description" size="small" muted />
                        </div>
                        <v-row>
                            <v-col v-for="agroupedField, agroupedFieldKey in field.items" :key="agroupedFieldKey" cols="12"
                                :sm="agroupedField.sizes?.sm" :md="agroupedField.sizes?.md" :lg="agroupedField.sizes?.lg"
                                :xl="agroupedField.sizes?.xl">
                                <v-text-field v-if="['text', 'number', 'email', 'password'].includes(agroupedField.type)"
                                    v-model="fdata[agroupedField.vModel]" :label="agroupedField.label" :type="agroupedField.type"
                                    :error-messages="errors[agroupedField.vModel]"></v-text-field>
                                <v-select v-else-if="['select', 'multiple_select'].includes(agroupedField.type)"
                                    :items="agroupedField.items" v-model="fdata[agroupedField.vModel]" item-title="text"
                                    item-value="value" :label="agroupedField.label" :error-messages="errors[agroupedField.vModel]"
                                    :multiple="agroupedField.type == 'multiple_select' ? true : false"></v-select>
                            </v-col>
                        </v-row>
                    </template>
                    <template v-else>
                        <v-text-field v-if="['text', 'number', 'email', 'password'].includes(field.type)"
                            v-model="fdata[field.vModel]" :label="field.label" :type="field.type"
                            :error-messages="errors[field.vModel]"></v-text-field>
                        <v-select v-else-if="['select', 'multiple_select'].includes(field.type)" :items="field.items"
                            v-model="fdata[field.vModel]" item-title="text" item-value="value" :label="field.label"
                            :error-messages="errors[field.vModel]"
                            :multiple="field.type == 'multiple_select' ? true : false"></v-select>
                    </template>
                </v-col>
            </template>
            <v-col cols="12" class="text-center">
                <v-btn @click.stop="method_submitFormButtonClick" prepend-icon="mdi-check" :text="submitButton.text"
                    color="primary" :loading="submitting"></v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>

import axios from '@/plugins/axios';
import alert from '@/services/alert';
import TinyTextElem from './TinyTextElem.vue';

export default {
    data() {
        return {
            valid: false,
            fdata: this.data,
            errors: {},
            submitting: false
        };
    },
    emits: {
        'submitForm': null
    },
    props: {
        data: {
            type: [Object],
            default: Object
        },
        /**
         * Array containing the form inputs or input groups
         *
         * {
         *      label: 'First name',
         *
         *      // can be: email, password, number, select, multiple_select, group
         *      type: 'text',
         *
         *      // when type is group(but is optional)
         *      description: 'Group description',
         *
         *      // required, except when type is group
         *      vModel: 'first_name',
         *
         *      // field sizes when type is not group
         *      sizes: {
         *          sm: 6,
         *          md: 4
         *      },
         *
         *      // required when type is select, multiple_select or a group(see the examples)
         *      items: [
         *          // select or multiple_select type example
         *          {
         *              text: 'Male',
         *              value: 'm'
         *          },
         *
         *          // object example for this array when type is group
         *          {
         *              label: 'Agrouped input',
         *              type: 'select',
         *              vModel: 'agroup_input',
         *              sizes: [],
         *              items: [
         *                  {
         *                      text: 'Item #1',
         *                      value: 1
         *                  },
         *                  {
         *                      text: 'Item #2',
         *                      value: 2
         *                  }
         *              ]
         *          }
         *      ]
         * }
         *
         */
        fields: {
            type: [Array],
            default: Array
        },
        submitButton: {
            type: Object,
            default: Object
        },
        /**
         *
         * Example #1:
         * {
         *      action: '/me/update',
         *      method: 'put',
         *      except: ['username'], // optional
         *      // optional
         *      success: {
         *          title: 'Updated!',
         *          message: 'Your profile has been updated'
         *      },
         *      // optional
         *      redirect: {
         *          success: 'route name here', // or
         *          success: {
         *              name: 'route name here'
         *          }, // or
         *          success: (response) => {
         *              // can be a callback function
         *          },
         *          fail: 'route name here', // or
         *          fail: {
         *              name: 'route name here'
         *          }, // or
         *          fail: (response) => {
         *              // can be a callback function
         *          },
         *      }
         * }
         *
         * Example #2:
         * {
         *      action: '/me/update',
         *      method: 'put',
         *      only: ['first_name', 'last_name', 'username'], // optional
         *      // optional
         *      success: {
         *          title: 'Updated!',
         *          message: 'Your profile has been updated'
         *      },
         *      // optional
         *      redirect: {
         *          success: 'route name here', // or
         *          success: {
         *              name: 'route name here'
         *          }, // or
         *          success: (response) => {
         *              // can be a callback function
         *          },
         *          fail: 'route name here', // or
         *          fail: {
         *              name: 'route name here'
         *          }, // or
         *          fail: (response) => {
         *              // can be a callback function
         *          },
         *      }
         * }
         */
        submitOptions: {
            type: Object,
            default: Object
        }
    },
    methods: {
        method_submitFormButtonClick(e) {
            if (!this.submitOptions?.action) {
                this.$emit('submitForm', e);
                return;
            }
            this.submitting = true;
            axios.req({
                action: this.submitOptions.action,
                method: this.submitOptions.method,
                data: this.method_getFormData(),
                success: (resp) => {
                    const successRedirect = this.submitOptions?.redirect?.success ?? null;
                    if (resp.data?.success) {
                        alert.addSuccess(this.submitOptions.success?.message ?? 'Formulário enviado!', this.submitOptions.success?.title ?? 'Enviado!', successRedirect ? true : false);
                        this.errors = {};
                        if (successRedirect) {
                            if (typeof successRedirect == 'string') {
                                this.$router.push({
                                    name: successRedirect
                                });
                            }
                            else if (typeof successRedirect == 'object') {
                                this.$router.push(successRedirect);
                            }
                            else if (typeof successRedirect == 'function') {
                                successRedirect(resp);
                            }
                        }
                    }
                },
                fail: (resp) => {
                    const failRedirect = this.submitOptions?.redirect?.fail ?? null;
                    this.errors = resp.response?.data?.errors ?? {};
                    if (failRedirect) {
                        const error = resp.response?.data?.error;
                        alert.addError(error, failRedirect ? true : false);
                        this.$router.push({
                            name: failRedirect
                        });
                    }
                },
                finally: () => {
                    this.submitting = false;
                }
            });
        },
        method_getFormData() {
            let sendableData = {};
            if (this.submitOptions?.only) {
                this.submitOptions.only.map((onl) => {
                    sendableData[onl] = this.fdata[onl];
                });
            }
            else if (this.submitOptions?.except) {
                sendableData = this.fdata;
                this.submitOptions.except.map((expt) => {
                    delete sendableData[expt];
                });
            }
            else {
                sendableData = this.fdata;
            }
            return sendableData;
        }
    },
    components: { TinyTextElem }
}

</script>
