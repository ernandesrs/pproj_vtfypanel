<template>
  <actions-bar bar-title="Meu perfil"></actions-bar>

  <v-row class="justify-center pa-8">
    <v-col cols="12" sm="10" lg="3" class="text-center">
      <v-avatar size="175">
        <v-img v-if="formUser.data?.photo_url" :src="formUser.data?.photo_url"></v-img>
        <div v-else class="text-h2 font-weight-bold w-100 h-100 d-flex justify-center align-center">
          {{ formUser.data?.first_name[0] }}{{ formUser.data?.last_name[0] }}
        </div>
      </v-avatar>
      <div class="py-3">
        <confirmation-button v-if="formUser.data?.photo_url" icon="mdi-trash-can-outline" text="Excluir foto" color="red"
          size="small" dialog-title="Excluir sua foto?" dialog-text="A foto não poderá ser recuperada."
          :confirm-callback="methodDeleteUserPhoto"></confirmation-button>
        <v-file-input @update:model-value="methodUploadUserPhoto" v-model="photoUpload.photo" v-else
          accept="image/png, image/jpeg, image/bmp" placeholder="Enviar foto" prepend-icon="mdi-account" label="Foto"
          :error-messages="photoUpload.errors?.photo"></v-file-input>
      </div>
    </v-col>
    <v-col cols="12" sm="10" lg="6">
      <v-card>
        <v-card-text>
          <v-form v-model="formUser.valid">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="formUser.data.first_name" label="Nome"
                  :error-messages="formUser.errors?.first_name"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="formUser.data.last_name" label="Sobrenome"
                  :error-messages="formUser.errors?.last_name"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="formUser.data.username" label="Usuário"
                  :error-messages="formUser.errors?.username"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="formUser.data.gender" label="Gênero" item-title="text" item-value="value" :items="[
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
                <v-text-field v-model="formUser.data.email" label="Email" readonly></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="formUser.data.password" label="Senha" :error-messages="formUser.errors?.password"
                  type="password"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="formUser.data.password_confirmation" label="Confirmar senha"
                  :error-messages="formUser.errors?.password_confirmation" type="password"></v-text-field>
              </v-col>
              <v-col cols="12" class="text-center">
                <v-btn @click.stop="methodUpdateUser" prepend-icon="mdi-check" text="Atualizar" color="primary"
                  :loading="formUser.submitting || photoUpload.uploading"></v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
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

export default {
  components: { ActionsBar, ConfirmationButton },
  data() {
    return {
      formUser: {
        valid: false,
        data: {},
        errors: {
        },
        submitting: false
      },
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

    this.formUser.data = useUserStore().getUser;
  },
  methods: {
    methodUpdateUser() {
      let data = this.formUser.data;

      this.formUser.submitting = true;
      axios.req({
        action: '/me/update',
        method: 'put',
        data: data,
        success: (resp) => {
          if (resp.data?.success) {
            alert.addInfo('Seu perfil foi atualizado com sucesso!', 'Atualizado!');

            this.formUser.errors = {};
          }
        },
        fail: (resp) => {
          this.formUser.errors = resp.response?.data?.errors ?? {};
        },
        finally: () => {
          this.formUser.submitting = false;
        }
      });
    },
    methodDeleteUserPhoto() {
      return axios.req({
        action: '/me/photo-delete',
        method: 'delete',
        success: () => {
          alert.addWarning('Sua foto foi excluída!', 'Excluída!');
          this.formUser.data.photo_url = null;
        }
      })
    },
    methodUploadUserPhoto(event) {
      let data = new FormData();

      data.append('photo', event[0]);

      this.photoUpload.uploading = true;
      return axios.req({
        action: '/me/photo-upload',
        method: 'post',
        data: data,
        success: (resp) => {
          alert.addInfo('Sua foto de perfil foi atualizada!', 'Foto atualizada!');
          this.formUser.data.photo_url = resp.data.user.photo_url;
          useUserStore().updateUser(resp.data.user);
        },
        fail: (resp) => {
          this.photoUpload.errors = resp.response.data?.errors;
        },
        finally: () => {
          this.photoUpload.uploading = false;
        }
      })
    }
  }
}

</script>