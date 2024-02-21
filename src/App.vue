/* eslint-disable */
<template>
  <div class="appContainer">
    <button @click="toggleLoginSignup" class="auth-toggle">Sign Up/Login</button>
    <div v-if="isShowingLogin">
      <LoginContainer />
    </div>
    <div v-else>
      <SignupContainer />
    </div>
  </div>
</template>
  
  <script>
import LoginContainer from './components/LoginContainer.vue';
import SignupContainer from './components/SignupContainer.vue';

  
  export default {
    name: 'App',
    components: {
      LoginContainer,
      SignupContainer,
    },
    data() {
    return {
      isShowingLogin: true,
    };
  },
  methods: {
    toggleLoginSignup() {
      this.isShowingLogin = !this.isShowingLogin;
    }
  }
}
</script>

  
  <style>
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: black;
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100%;
    overflow: hidden;
  }

  .auth-toggle {
  position: absolute;
  right: 1%;
  top: 2%;
  padding: 10px 20px;
  background-color: #ffffff;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.auth-toggle:hover {
  background-color: #dbdbdb;
}
  </style>
  