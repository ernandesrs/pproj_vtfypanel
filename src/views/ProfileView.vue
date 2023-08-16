<template>
  <actions-bar bar-title="Meu perfil"></actions-bar>

  <v-row class="justify-center pa-8">
    <v-col cols="12" sm="10" lg="3" class="text-center">
      <v-avatar size="175">
        <v-img v-if="data?.photo_url" :src="data?.photo_url"></v-img>
        <div v-else class="text-h2 font-weight-bold w-100 h-100 d-flex justify-center align-center">
          {{ data?.first_name[0] }}{{ data?.last_name[0] }}
        </div>
      </v-avatar>
      <div class="py-3">
        <confirmation-button v-if="data?.photo_url" icon="mdi-trash-can-outline" text="Excluir foto" color="red"
          size="small" dialog-title="Excluir sua foto?" dialog-text="A foto não poderá ser recuperada."
          :confirm-callback="method_deleteUserPhoto"></confirmation-button>
        <v-file-input @update:model-value="method_uploadUserPhoto" v-model="photoUpload.photo" v-else
          accept="image/png, image/jpeg, image/bmp" placeholder="Enviar foto" prepend-icon="mdi-account" label="Foto"
          :error-messages="photoUpload.errors?.photo"></v-file-input>
      </div>
    </v-col>

    <v-col cols="12" sm="10" lg="6">
      <v-form>
        <group-elem title="Dados da sua conta" description="Atualize os dados da sua conta">
          <template #content>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="data.first_name" label="Nome" :error-messages="errors?.first_name"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="data.last_name" label="Sobrenome"
                  :error-messages="errors?.last_name"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="data.username" label="Usuário" :error-messages="errors?.username"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="data.gender" label="Gênero" item-title="text" item-value="value" :items="[
                  {
                    text: 'Masculino',
                    value: 'm'
                  },
                  {
                    text: 'Feminino',
                    value: 'f'
                  },
                  {
                    text: 'Não definir',
                    value: 'n'
                  }
                ]"></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="data.email" label="Email" :error-messages="errors?.email" readonly></v-text-field>
              </v-col>
            </v-row>
          </template>
        </group-elem>
        <group-elem title="Segurança" description="Informe e confirme uma nova senha segura para sua conta">
          <template #content>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="data.password" @click:append-inner="visiblePassword = !visiblePassword"
                  :append-inner-icon="visiblePassword ? 'mdi-eye' : 'mdi-eye-off'" label="Senha"
                  :error-messages="errors?.password" :type="visiblePassword ? 'text' : 'password'"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="data.password_confirmation"
                  @click:append-inner="visiblePassword = !visiblePassword"
                  :append-inner-icon="visiblePassword ? 'mdi-eye' : 'mdi-eye-off'" label="Confirmar senha"
                  :error-messages="errors?.password_confirmation"
                  :type="visiblePassword ? 'text' : 'password'"></v-text-field>
              </v-col>
            </v-row>
          </template>
        </group-elem>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-btn @click.stop="method_submitForm" prepend-icon="mdi-check" text="Atualizar perfil" color="primary"
              :loading="submitting"></v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>

import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import axios from '@/plugins/axios';
import alert from '@/services/alert';
import ActionsBar from '@/layouts/default/ActionsBar.vue';
import ConfirmationButton from '@/components/ConfirmationButton.vue';
import GroupElem from '@/components/GroupElem.vue';

export default {
  components: { ActionsBar, ConfirmationButton, GroupElem },
  data() {
    return {
      data: {},
      errors: {},
      submitting: false,
      visiblePassword: false,
      photoUpload: {
        uploading: false,
        photo: null,
        errors: {}
      }
    };
  },
  created() {
    useAppStore().updateBreadcrumbs([
      {
        title: "Home",
        disabled: false,
        to: { name: "app.home" }
      },
      {
        title: "Perfil",
        disabled: true,
        to: { name: "app.profile" }
      }
    ]);

    this.data = useUserStore().getUser;
  },
  methods: {
    method_deleteUserPhoto() {
      return axios.req({
        action: '/me/photo-delete',
        method: 'delete',
        success: () => {
          alert.addWarning('Sua foto foi excluída!', 'Excluída!');
          this.data.photo_url = null;
        }
      })
    },
    method_uploadUserPhoto(event) {
      let data = new FormData();

      data.append('photo', event[0]);

      this.photoUpload.uploading = true;
      return axios.req({
        action: '/me/photo-upload',
        method: 'post',
        data: data,
        success: (resp) => {
          alert.addInfo('Sua foto de perfil foi atualizada!', 'Foto atualizada!');
          this.data.photo_url = resp.data.user.photo_url;
          useUserStore().updateUser(resp.data.user);
        },
        fail: (resp) => {
          this.photoUpload.errors = resp.response.data?.errors;
        },
        finally: () => {
          this.photoUpload.uploading = false;
        }
      })
    },
    method_submitForm() {
      let data = {
        first_name: this.data.first_name,
        last_name: this.data.last_name,
        username: this.data.username,
        gender: this.data.gender,
        email: this.data.email
      };
      const action = '/me/update';
      const method = 'put';

      if (this.data.password?.length > 0 || this.data.password_confirmation?.length > 0) {
        data = {
          ...data,
          password: this.data.password,
          password_confirmation: this.data.password_confirmation
        };
      }

      this.submitting = true;
      axios.req({
        action: action,
        method: method,
        data: data,
        success: (resp) => {
          alert.add('Os dados da sua conta foram atualizados com sucesso!',
            'info',
            'Atualizado!',
            null
          );

          // update user store
          useUserStore().updateUser(resp.data.user);

          this.errors = {};
          this.data.password = '';
          this.data.password_confirmation = '';
        },
        fail: (resp) => {
          this.errors = resp.response.data.errors;
        },
        finally: () => {
          this.submitting = false;
        }
      });
    }
  }
}

</script>