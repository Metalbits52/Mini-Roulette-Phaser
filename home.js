export default class HomeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HomeScene' });
    this.loading = null;
  }

  preload() {
    this.load.image('background', 'images/background.png');
    this.load.image('logo', 'images/logo.png');
    this.load.image('tapToBegin', 'images/tap-to-begin.png');
    this.load.image('loading', 'images/loading-icon.png');
    this.load.image('paytable-overlay', 'images/paytable-overlay.png');
    this.load.html('loginForm', 'login-form.html');
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    let payTableOverlay = this.add.image(centerX, centerY, 'paytable-overlay')
    .setDisplaySize(1920, 1080)
    .setOrigin(0.5)
    .setDepth(1)
    .setVisible(false);

    this.loading = this.add.image(centerX, centerY, 'loading').setDisplaySize(240, 240).setDepth(2).setVisible(false);
    this.add.image(centerX, centerY, 'background').setDisplaySize(1920, 1080);
    this.add.image(centerX, centerY, 'logo').setDisplaySize(250, 250).setDepth(1);

    // let startGameButton = this.add.image(centerX, centerY, 'tapToBegin').setDisplaySize(1920, 1080).setInteractive();
    // startGameButton.on('pointerup', () => {
    //   this.scale.startFullscreen();
    //   this.loading.setVisible(true);
    //   payTableOverlay.setVisible(true);
    //   this.startGame();
    // });

    // this.tweens.add({
    //   targets: startGameButton,
    //   alpha: { from: 1, to: 0 },
    //   duration: 3000,
    //   yoyo: true,
    //   repeat: -1,
    //   ease: 'Sine.easeInOut'
    // });

    const loginForm = this.add.dom(centerX, centerY+300).createFromCache('loginForm');
    loginForm.addListener('click');
    loginForm.on('click', (event) => {
      if(event.target.name === "Login")
      {
        this.scale.startFullscreen();
        this.loading.setVisible(true);
        payTableOverlay.setVisible(true);
        this.startGame();
      }
    });
  }

  update()
  {
    this.loading.angle += 2.25; 
  }

  async startGame() {

    let token = localStorage.getItem("token") || 0;
    
    await axios.post("https://game-api.j4u.app/getUser", {}, {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      if(!response.data.status)
      {
        return alert(response.data.message);
      }

      let user_id = response.data.data.user_id;
      let username = response.data.data.username;
      let balance_wallet = response.data.data.balance_wallet;
      let merchant = response.data.data.merchant;
      this.scene.start('GameScene', { user_id, username, balance_wallet, merchant, token});
    })
  }
}
