<template>
  <dialog class="fixed z-50" :open="!db.isLoggedIn">
    <div
      class="fixed inset-0 min-h-screen overflow-y-auto bg-black opacity-40"
    ></div>
    <div class="fixed inset-0 flex flex-row items-center justify-center p-2">
      <form
        @submit.prevent="onSubmit"
        class="flex w-96 max-w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-xl"
      >
        <p>
          Nutzername:
          <input
            class="w-full rounded-xl bg-stone-200 p-2"
            name="username"
            label="Nutzername"
            v-model="_username"
            rules="required"
            autocomplete="username"
          />
        </p>
        <p>
          Passwort:
          <input
            class="w-full rounded-xl bg-stone-200 p-2"
            name="password"
            label="Passwort"
            type="password"
            v-model="_password"
            rules="required"
            autocomplete="current-password"
          />
        </p>
        <div class="flex flex-row justify-end gap-4">
          <button
            type="submit"
            class="w-full rounded-xl border-2 border-black p-2"
            :class="submitButtonClasses"
          >
            Anmelden
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthDb } from "../stores/authDb";

const _username = ref("");
const _password = ref("");
const db = useAuthDb();

const submitButtonClasses = ref("");
function shakeSubmitButton() {
  submitButtonClasses.value = "animate-shake";
  setTimeout(() => {
    submitButtonClasses.value = "";
  }, 1000);
}

async function onSubmit() {
  const successfulLogin =
    _username.value !== "" &&
    _password.value !== "" &&
    (await db.login(_username.value, _password.value));
  if (!successfulLogin) {
    shakeSubmitButton();
  }
}
</script>
