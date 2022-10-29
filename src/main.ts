import { mushroomPinia } from 'mushroom-pinia';
import { createApp } from 'vue';
import App from './App.vue';
import { AppStore } from './stores/appStore';

createApp(App).use(mushroomPinia).mount('#app');

const worker = new Worker('worker.js');

// const blob = new Blob([document.querySelector('#worker').textContent]);
// const url = window.URL.createObjectURL(blob);
// const worker = new Worker(url);

function fn(): void {
    console.log('abc');
}

const obj = {
    run: AppStore.toString()
};

worker.postMessage(obj);
