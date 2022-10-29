self.addEventListener('message', (event) => {
    console.log(event.data);
    console.log(window);
});
