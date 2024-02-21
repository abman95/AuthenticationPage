/* eslint-disable */
<template>
<div id="loginPage" v-if="!loggedIn">
        <div class="login-card" v-if="!loading">
            <h2>Login</h2>
            <h3>Geben Sie eine E-Mail und ein Passwort ein</h3>
            <div v-if="loginError" :style="{ color: signupColor }">{{ loginMessage }}</div>
            <form class="login-form">
                <div class="username">
                    <input v-model="email" class="control" type="email" placeholder="Email" />
                </div>
                <div class="password" style="position: relative;">
                    <input :type="passwordFieldType" v-model="password" class="control" placeholder="Passwort" />
                    <img @click="togglePasswordVisibility" class="show-password-btn" :src="passwordFieldType === 'password' ? require('../assets/icons/noshow.svg') : require('../assets/icons/show.svg')" alt="Show Password">
                </div>
                <button @click.prevent="login" class="control submitButton" type="button">Einloggen</button>
            </form>
        </div>
        <div v-if="loading" class="loader"></div>
    </div>
    <div v-if="loggedIn" class="loggedInContainer">
        <h1>Willkommen zurück {{ userData.name }}</h1>
        <p>E-Mail: {{ userData.email }}</p>
        <p>Phone Number: {{ userData.phonenumber }}</p>
        <p>Passwort: {{ userData.password }}</p>
        <button @click="deleteUser(userData.id)" class="control loeschen-btn">Löschen</button>
    </div>
  </template>
  
  <script>
export default {
  name: 'LoginContainer',
  data() {
  return {
    email: '',
    password: '',
    loading: false,
    loggedIn: false,
    loginError: false,
    loginMessage: '',
    passwordFieldType: 'password',
    userData: '',
    signupColor: 'red',
  };
},
    methods: {
        togglePasswordVisibility() {
          this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
        },

        async deleteUser(id) {
            const response = await fetch(`http://localhost:3000/User/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            this.loading = true;
            setTimeout(async () => {
                    this.loading = false;
            }, 2000);
            if (response.ok) {
                this.loggedIn = false;
                this.loginError = true;
                this.signupColor = 'green';
                this.loginMessage = data.message;
            } else {
                this.loginError = true;
                this.signupColor = 'red';
                this.loginMessage = data.message;
            }
        },

        async login() {
            this.loginError = false;
            this.loading = true;
            setTimeout(async () => {
                try {
                    const response = await fetch('http://localhost:3000/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: this.email, password: this.password }),
                    });
                    if (response.ok) {
                        this.loggedIn = true;
                        this.signupColor = 'green';
                        this.loginMessage = 'Login erfolgreich';
                        this.userData = await response.json();
                    } else {
                        this.loginError = true;
                        this.signupColor = 'red';
                        this.loginMessage = 'Login fehlgeschlagen';
                    }
                } catch (error) {
                    console.error('Fehler bei der Anmeldung', error);
                    this.loginError = true;
                } finally {
                    this.loading = false;
                }
            }, 2000);
        },
    }
  }
  </script>
  
  <style scoped>
    * {
  box-sizing: border-box;
}

html,
body,
.wrapper {
  height: 100%;
}

@keyframes rotate {
  100% {
    background-position: 0% 50%;
  }
}

body {
  display: grid;
  place-items: center;
  margin: 0;
  background-color: #000000;
  background-repeat: no-repeat;
  background-size: 200vh;
  font-family: "Euclid Circular A";
  color: #868b94;
  animation: rotate 5s infinite alternate linear;
}

button {
  background: transparent;
  border: 0;
  cursor: pointer;
}

.control {
  border: 0;
  border-radius: 8px;
  outline: none;
  width: 100%;
  height: 56px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #f9f9f9;
  margin: 8px 0;
  font-family: inherit;
  text-align: left;
  font-size: 16px;
  transition: 0.4s;
}


.login-card {
  width: 400px;
  padding: 100px 30px 32px;
  border-radius: 1.25rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(26px);
  text-align: center;
}

.login-card > h2 {
  font-size: 36px;
  font-weight: 600;
  margin: 0 0 6px;
  color: #f9f9f9;
}

.login-card .loginImage {
  width: 120px;
  border-radius: 50%;
  padding: 5px;
  margin-bottom: 20px;
}

.login-card > h3 {
  color: #837f90;
  margin: 0 0 40px;
  font-weight: 500;
  font-size: 1rem;
}

.login-form {
  width: 100%;
  margin: 0;
  display: grid;
}

.login-form input.control::placeholder {
  color: #868b94;
}

.login-form > button.control {
  cursor: pointer;
  width: 100%;
  height: 56px;
  padding: 0 16px;
  background: #f9f9f9;
  color: #000000;
  border: 0;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  letter-spacing: 2px;
  transition: all 0.375s;
}

.username {
  position: relative;
}

@keyframes spin {
  100% {
    rotate: 1turn;
  }
}

.spinner {
  position: absolute;
  top: 50%;
  right: 16px;
  translate: 0 -50%;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 3px solid #ccc9e1;
  border-top-color: #8f44fd;
  opacity: 0;
  animation: spin 1s infinite linear;
}

.spinner.visible {
  opacity: 1;
}

.indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

#bars {
  margin: 8px 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
}

#bars div {
  height: 6px;
  border-radius: 3px;
  transition: 0.4s;
  width: 0%;
}

#bars.weak div {
  background: #bc2b38;
  width: 25%;
}

#bars.medium div {
  background: #d36f30;
  width: 50%;
}

#bars.strong div {
  background: #43ff95;
  width: 75%;
}

#bars.very-strong div {
  background: #008339;
  width: 100%;
}

.strength { 
  text-align: left;
  height: 30px;
  text-transform: capitalize;
}

#submit:hover {
  background-color: #f2f2f2c6;
}


.loggedInContainer {
  color: white;
}

.loader {
  display: inline-block;
  width: 80px;
  height: 80px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loader:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #fff;
  border-color: #fff transparent #fff transparent;
  animation: spin 1.2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.password {
  position: relative;
  display: flex;
  align-items: center;
}

.show-password-btn {
  filter: invert(0.3);
  cursor: pointer;
  position: absolute;
  right: 20px;
  height: 25px;
}

.control.submitButton:hover {
  background-color: rgb(212, 212, 212);
}
  </style>