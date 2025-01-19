<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="register" class="register-form">
      <div class="form-group">
        <label for="firstName">Nama Depan:</label>
        <input type="text" id="firstName" v-model="firstName" required>
      </div>
      <div class="form-group">
        <label for="lastName">Nama Belakang:</label>
        <input type="text" id="lastName" v-model="lastName" required>
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div class="form-group">
        <label for="confirmPassword">Konfirmasi Password:</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required>
      </div>
      <button type="submit">Register</button>
    </form>
    <p>Sudah punya akun? <router-link to="/login">Login</router-link></p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';

export default {
  name: 'RegisterPage',
  setup() {
    const firstName = ref('');
    const lastName = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const router = useRouter();

    const register = async () => {
      if (email.value.length < 4 || password.value.length < 4) {
        alert('Email dan password harus minimal 4 karakter');
        return;
      }
      if (password.value !== confirmPassword.value) {
        alert('Password dan konfirmasi password tidak cocok');
        return;
      }

      const db = getFirestore();

      // Check if the user data already exists
      const usersQuery = query(
        collection(db, 'users'),
        where('firstName', '==', firstName.value),
        where('lastName', '==', lastName.value)
      );
      const querySnapshot = await getDocs(usersQuery);

      if (!querySnapshot.empty) {
        alert('Pengguna dengan email ini sudah terdaftar.');
        return;
      }

      try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value
        });
        router.push('/chat');
      } catch (error) {
        alert(error.message);
      }
    };

    return {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      register
    };
  }
};
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.register-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

label {
  font-weight: bold;
}

input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-sizing: border-box;
  width: 100%;
}

button {
  padding: 10px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  width: 100%;
  margin-top: 15px;
}

button:hover {
  background-color: #0056b3;
}

p {
  margin-top: 15px;
}
</style>
