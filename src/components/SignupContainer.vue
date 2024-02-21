<template>
    <div id="signupPage">
        <div class="login-card">
            <img src="https://i.pinimg.com/originals/0a/5f/ea/0a5feae400fc816c4ca2aca8bd67a168.jpg" class="loginImage"/>
            <h2>Sign Up</h2>
            <h3>Enter a E-Mail and Password</h3>
            <div v-if="signupStatus" :style="{ color: signupColor }">{{ signupStatusContent }}</div>
            <form class="login-form">
                <div class="name">
                    <input v-model="name" autocomplete="off" spellcheck="false" class="control" type="name" placeholder="Name"/>
                </div>
                <div class="email">
                    <input v-model="email" autocomplete="off" spellcheck="false" class="control" type="email" placeholder="Email"/>
                </div>
                <div class="phonenumber">
                    <input v-model="phonenumber" autocomplete="off" spellcheck="false" class="control" type="phonenumber" placeholder="Phone Number"/>
                </div>
                <div class="password" style="position: relative;">
                    <input :type="passwordFieldType" v-model="password"  @input="evaluatePasswordStrength" class="control" placeholder="Passwort" />
                    <img @click="togglePasswordVisibility" class="show-password-btn" :src="passwordFieldType === 'password' ? require('../assets/icons/noshow.svg') : require('../assets/icons/show.svg')" alt="Show Password">
                </div>
                <div id="bars" :class="`${passwordStrengthClass}`">
                    <div></div>
                </div>
                <div class="strength">{{ passwordStrengthText }}</div>
                <button @click.prevent="submitForm" class="control submitButton" type="button">JOIN NOW</button>
            </form>
        </div>
    </div>
  </template>
  
  <script>
  export default {
  name: 'SignupContainer',
  data() {
    return {
      name: '',
      email: '',
      phonenumber: '',
      password: '',
      loading: false,
      signupStatus: false,
      signupStatusContent: '',
      passwordStrengthClass: '',
      passwordStrengthText: '',
      signupColor: 'red',
      passwordFieldType: 'password',
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    },

    evaluatePasswordStrength() {
      const strengthValue = { upper: false, numbers: false, lower: false, specialCharacters: false };
      let strengthIndicator = 0;

      for (let index = 0; index < this.password.length; index++) {
        let char = this.password.charCodeAt(index);
        if (!strengthValue.upper && char >= 65 && char <= 90) {
          strengthValue.upper = true;
        } else if (!strengthValue.numbers && char >= 48 && char <= 57) {
          strengthValue.numbers = true;
        } else if (!strengthValue.lower && char >= 97 && char <= 122) {
          strengthValue.lower = true;
        } else if (!strengthValue.specialCharacters && ([[32, 47], [58, 64], [91, 96], [123, 126]].some(([start, end]) => char >= start && char <= end))) {
          strengthValue.specialCharacters = true;
        }
      }

      for (let metric in strengthValue) {
        if (strengthValue[metric]) strengthIndicator++;
      }

      this.passwordStrengthClass = this.getStrengthClass(strengthIndicator);
      this.passwordStrengthText = this.passwordStrengthClass ? `${this.passwordStrengthClass.replace('-', ' ')} Password` : '';
    },

    getStrengthClass(strengthIndicator) {
      const strength = { 1: "weak", 2: "medium", 3: "strong", 4: "very-strong" };
      return strength[strengthIndicator] || '';
    },

    async submitForm() {
  if (!this.email || !this.password) {
    this.signupStatus = true;
    this.signupStatusContent = 'E-Mail und Passwort müssen ausgefüllt sein.';
    this.signupColor = 'red';
    return;
  }
  this.loading = true;
  this.signupStatus = false;
  let response;
  try {
    response = await fetch('http://localhost:3000/newUser', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: this.name, email: this.email, phonenumber: this.phonenumber, password: this.password }),
    });
    const data = await response.json(); // Verarbeite die JSON-Antwort
    if (response.ok) {
      this.signupStatusContent = data.message; // Nachricht vom Server
      this.signupColor = 'green';
    } else {
      this.signupStatusContent = data.message; // Fehlermeldung vom Server
      this.signupColor = 'red';
    }
    this.signupStatus = true;
  } catch (error) {
    this.signupStatusContent = 'Fehler bei der Verbindung zum Server.';
    this.signupColor = 'red';
    this.signupStatus = true;
  } finally {
    this.loading = false;
    if (response && response.ok) {
      this.name = '';
      this.email = '';
      this.phonenumber = '';
      this.password = '';
      this.passwordStrengthClass = '';
      this.passwordStrengthText = '';
    }
  }
}

  }
};

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

.email {
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
  color: #837f90;
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
  