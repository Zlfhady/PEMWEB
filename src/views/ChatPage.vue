<template>
  <div class="chat-app">
    <div class="chat-header">
      <h1>One Chat</h1>
    </div>
    <div class="chat-container" ref="chatContainerRef">
      <div v-for="message in messages" :key="message.id" class="message"
           :class="{ 'my-message': message.user === auth.currentUser.email, 'left-message': message.user !== auth.currentUser.email, 'right-message': message.user === auth.currentUser.email }">
        <div class="message-content">
          <div class="message-user">{{ message.user }}</div>
          <div class="message-text">{{ message.text }}</div>
          <div class="message-timestamp">{{ formatDate(message.timestamp) }}</div>
        </div>
      </div>
    </div>
    <form @submit.prevent="sendMessage" class="chat-input">
      <input type="text" v-model="newMessage" placeholder="Ketik pesan" required />
      <button type="submit">Kirim</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue';
import { auth, db } from '../main';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

export default {
  setup() {
    const messages = ref([]);
    const newMessage = ref('');
    const chatContainerRef = ref(null);

    const scrollToBottom = () => {
      nextTick(() => {
        const chatContainer = chatContainerRef.value;
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      });
    };

    const fetchMessages = () => {
      const q = query(collection(db, 'messages'), orderBy('timestamp'));
      onSnapshot(q, snapshot => {
        messages.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        scrollToBottom();
      });
    };

    const sendMessage = async () => {
      if (!newMessage.value.trim()) return;

      await addDoc(collection(db, 'messages'), {
        text: newMessage.value,
        user: auth.currentUser.email,
        timestamp: new Date()
      });

      newMessage.value = '';
      scrollToBottom();
    };

    const formatDate = (date) => {
      const diff = (new Date() - date.toDate()) / 1000;
      if (diff < 60) return `${Math.floor(diff)} detik yang lalu`;
      if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`;
      return `${Math.floor(diff / 86400)} hari yang lalu`;
    };

    onMounted(() => {
      fetchMessages();
    }); 

    return {
      messages,
      newMessage,
      sendMessage,
      formatDate,
      chatContainerRef,
      auth
    };
  }
};
</script>

<style>
.chat-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #4f788b;
}

.chat-header {
  background-color: #071a2e;
  color: whitesmoke;
  padding: 1rem;
}

.chat-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.message {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
  max-width: 70%; 
}

.message-content {
  background-color: #dcf8c6; 
  color: black;
  border-radius: 8px;
  padding: 0.5rem;
}

.message-user {
  font-size: 0.8rem;
  margin-bottom: 0.2rem;
}

.message-text {
  font-size: 1rem;
}

.message-timestamp {
  align-self: flex-end; 
  color: grey;
  font-size: 0.7rem;
  margin-top: 0.2rem;
}

.my-message {
  align-self: flex-end; 
}

.my-message .message-content {
  background-color: #a4ee6c; 
}

.received-message {
  align-self: flex-start; 
}

.chat-input {
  background-color: #f1f1f1;
  padding: 1rem;
  display: flex;
  align-items: center;
}

.chat-input input {
  flex-grow: 1;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
}

.chat-input button {
  margin-left: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>

