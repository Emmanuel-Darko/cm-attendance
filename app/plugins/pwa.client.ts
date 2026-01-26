export default defineNuxtPlugin(() => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          // Registration successful
        })
        .catch(error => {
          // Registration failed
          // Optionally handle the error
        });
    });
  }
})
