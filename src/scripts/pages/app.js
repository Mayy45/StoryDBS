  class App {
  constructor({ content, drawerButton, navigationDrawer }) {
    this._content = content;
    this._drawerButton = drawerButton;
    this._navigationDrawer = navigationDrawer;
    this._initialAppShell();
  }

  _initialAppShell() {
    this._drawerButton.addEventListener('click', (event) => {
      this._navigationDrawer.classList.toggle('open');
      event.stopPropagation();
    });

    window.addEventListener('click', (event) => {
      if (!this._navigationDrawer.contains(event.target) && event.target !== this._drawerButton) {
        this._navigationDrawer.classList.remove('open');
      }
    });

    const skipLink = document.querySelector('.skip-link');
    skipLink.addEventListener('click', function (event) {
      event.preventDefault();
      const mainContent = document.querySelector('#main-content');
      skipLink.blur();
      mainContent.focus();
      mainContent.scrollIntoView();
    });
  }

  async renderPage(PageModule) {
    if (typeof PageModule === 'function') {
      const instance = new PageModule();
  
      if (typeof instance.init === 'function') {
        await instance.init();
      }
  
      return instance; 
    } else if (typeof PageModule.init === 'function') {
      await PageModule.init();
      return null; 
    } else {
      console.error('Invalid page module:', PageModule);
      return null;
    }
  }
}  

export default App;
