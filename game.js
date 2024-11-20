let currency = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumIntegerDigits: 1,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.balanceText
    this.winningPanelContainer = null;
    this.chipSet = [];
    this.selectedChip = 1;
    this.previousBetInfo = [];
    this.betInfo = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.currentBet = 0;
    this.currentBetText = null;
    this.wheelContainer = null;
    this.betContainer = null;
    this.paytableGuideContainer = null;
    this.isPause = null;
  }

  init(data) {
    this.user_id = data.user_id;
    this.username = data.username;
    this.balance_wallet = data.balance_wallet;
    this.token = data.token;

    this.currentSelectedCurrency = "USDE"
  }

  preload() {
    this.load.audio('bgm', 'sounds/background_music.mp3');
    this.load.audio('winning_sound', 'sounds/winning_sound.mp3');
    this.load.audio('bet', 'sounds/bet.mp3');
    this.load.audio('spinning_sound', 'sounds/spinning_sound.mp3');

    this.load.image('background', 'images/background.png');
    this.load.image('grid', 'images/empty-grid.png');
    this.load.image('navBar', 'images/navBar.png');

    this.load.image('text-paytable', 'images/text-paytable.png');
    this.load.image('paytable-guide', 'images/paytable-guide.png');
    this.load.image('paytable-overlay', 'images/paytable-overlay.png');
    this.load.image('clear-button', 'images/clear-button.png');
    this.load.image('rebet-button', 'images/rebet-button.png');
    this.load.image('fullscreen', 'images/fullscreen.png');
    this.load.image('withdraw-button', 'images/withdraw-button.png');
    this.load.image('winning-panel', 'images/winning-panel.png');

    this.load.image('spin-wheel-back', 'images/spin-wheel-back.png');
    this.load.image('spin-wheel-clicker', 'images/spin-wheel-clicker.png');
    this.load.image('spin-wheel-icon', 'images/spin-wheel-icon.png');
    this.load.image('spin-wheel-icon-disabled', 'images/spin-wheel-icon-disabled.png');

    this.load.image('spin-wheel-numbers', 'images/spin-wheel-numbers.png');
    this.load.image('spin-wheel-inner-frame', 'images/spin-wheel-inner-frame.png');
    this.load.image('ball-holder', 'images/ball-holder.png');
    this.load.image('rotating-ball', 'images/rotating-ball.png');

    this.load.image('spin-wheel-numbers-1', 'images/spin-wheel-numbers-1.png');
    this.load.image('spin-wheel-numbers-2', 'images/spin-wheel-numbers-2.png');
    this.load.image('spin-wheel-numbers-3', 'images/spin-wheel-numbers-3.png');
    this.load.image('spin-wheel-numbers-4', 'images/spin-wheel-numbers-4.png');
    this.load.image('spin-wheel-numbers-5', 'images/spin-wheel-numbers-5.png');
    this.load.image('spin-wheel-numbers-6', 'images/spin-wheel-numbers-6.png');
    this.load.image('spin-wheel-numbers-7', 'images/spin-wheel-numbers-7.png');
    this.load.image('spin-wheel-numbers-8', 'images/spin-wheel-numbers-8.png');
    this.load.image('spin-wheel-numbers-9', 'images/spin-wheel-numbers-9.png');
    this.load.image('spin-wheel-numbers-10', 'images/spin-wheel-numbers-10.png');
    this.load.image('spin-wheel-numbers-11', 'images/spin-wheel-numbers-11.png');
    this.load.image('spin-wheel-numbers-12', 'images/spin-wheel-numbers-12.png');

    this.load.image('chip-1', 'images/chip-1.png');
    this.load.image('chip-2', 'images/chip-2.png');
    this.load.image('chip-3', 'images/chip-3.png');
    this.load.image('chip-4', 'images/chip-4.png');
    this.load.image('chip-5', 'images/chip-5.png');
    this.load.image('chip-6', 'images/chip-6.png');
    this.load.image('chip-7', 'images/chip-7.png');

    this.load.image('empty-red', 'images/empty-red.png');
    this.load.image('red-1', 'images/red-1.png');
    this.load.image('red-3', 'images/red-3.png');
    this.load.image('red-5', 'images/red-5.png');
    this.load.image('red-8', 'images/red-8.png');
    this.load.image('red-10', 'images/red-10.png');
    this.load.image('red-12', 'images/red-12.png');

    this.load.image('empty-black', 'images/empty-black.png');
    this.load.image('black-2', 'images/black-2.png');
    this.load.image('black-4', 'images/black-4.png');
    this.load.image('black-6', 'images/black-6.png');
    this.load.image('black-7', 'images/black-7.png');
    this.load.image('black-9', 'images/black-9.png');
    this.load.image('black-11', 'images/black-11.png');

    this.load.image('text-1-6', 'images/text-1-6.png');
    this.load.image('text-7-12', 'images/text-7-12.png');
    this.load.image('text-even', 'images/text-even.png');
    this.load.image('text-odd', 'images/text-odd.png');

    this.load.image('golden-circle', 'images/golden-circle.png');
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.sound.unlock();
    var music = this.sound.add('bgm');
    
		if (!this.sound.locked) {
			music.play();
		}
		else {  // IF Not wait on unlock event 
			this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
				music.play();
			})
		}

    this.add.image(centerX, centerY, 'background').setDisplaySize(1920, 1080);

    this.add.image(centerX, 1080, 'navBar').setDisplaySize(1920, 138).setOrigin(0.5, 1);
    
    let winningPanel = this.add.image(0, 0, 'winning-panel').setDisplaySize(326, 226);
    let winningPanelValue = this.add.text(0, 0, "", { 
      font: '24px Inter-Regular', 
      fill: '#21F921',
      alpha: 1,
    })
    .setOrigin(0.5);
    this.winningPanelContainer = this.add.container(centerX, centerY, [winningPanel, winningPanelValue]).setDepth(3).setAlpha(0);

    let paytableGuide = this.add.image(centerX, centerY, 'paytable-guide')
    .setDisplaySize(686, 468)
    .setOrigin(0.5)
    .setVisible(false);

    let payTableOverlay = this.add.image(centerX, centerY, 'paytable-overlay')
    .setDisplaySize(1920, 1080)
    .setOrigin(0.5)
    .setVisible(false)

    payTableOverlay.on('pointerdown', () => {
      this.showPaytable();
    });

    let paytableText = this.add.text(centerX, centerY + 300, "- click anywhere to close -", { 
      font: '24px Inter-Regular', 
      fill: '#ffffff',
      alpha: 0.5,
    }).setOrigin(0.5)
    .setVisible(false);
    
    this.paytableGuideContainer = this.add.container(0, 0, [payTableOverlay, paytableGuide, paytableText]);

    this.add.text(centerX + 540, 1050, "1 Chip = 1 USDE", { 
      font: '24px Inter-Regular', 
      fill: '#808183',
      alpha: 0.5,
    }).setOrigin(0.5);

    this.balanceText = this.add.text(centerX - 590, 1000, `${currency.format(this.balance_wallet1)}`, { 
      font: '24px Inter-Regular', 
      fill: '#ffffff' 
    }).setOrigin(0, 0.5);

    let fullscreenButton = this.add.image(50, 50, 'fullscreen').setDisplaySize(64, 64).setInteractive();
    fullscreenButton.setOrigin(0.5);

    fullscreenButton.on('pointerup', () => {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
      } else {
        this.scale.startFullscreen();
      }
    });

    let withdrawButton = this.add.image(1810, 40, 'withdraw-button').setDisplaySize(180, 64).setInteractive();
    withdrawButton.setOrigin(0.5);

    withdrawButton.on('pointerup', () => {
      // switch(this.merchant)
      // {
      //   case 1:
      //   case "1":
      //     window.location.href = `https://game-withdraw.j4u.app?token=${this.token}`;
      //     break;
      //   case 2:
      //   case "2":
      //     window.location.href = `https://game-withdraw.mkinternational.io?token=${this.token}`;
      //     break;
      // }
    });

    this.setupWheel(centerX, centerY);
    this.setupChip(centerX, centerY);
    this.setupBet(centerX, centerY);
  }

  setupWheel(centerX, centerY) {
    let spinnerBackground = this.add.image(0, 0, 'spin-wheel-back').setDisplaySize(756, 756);
    let spinner = this.add.image(0, 0, 'spin-wheel-numbers').setDisplaySize(624, 624).setDepth(1);
    let spinWheelNumbersContainer = this.add.container(0, 0, []);

    for (let i = 1; i <= 12; i++) {
      let image = this.add.image(0, 0, `spin-wheel-numbers-${i}`).setDisplaySize(624, 624);
      image.setAlpha(0);
      image.setDepth(2);
      spinWheelNumbersContainer.add(image);
    }

    let spinnerFrame = this.add.image(0, 0, 'spin-wheel-inner-frame').setDisplaySize(662, 662).setDepth(3);
    let ballHolder = this.add.image(0, 0, 'ball-holder').setDisplaySize(500, 500).setOrigin(0.5).setDepth(1);
    let ball = this.add.image(0, -225, 'rotating-ball').setDisplaySize(47, 47).setOrigin(0.5).setDepth(4);
    
    let ballContainer = this.add.container(0, 0, [ballHolder, ball]);
    let spinnerContainer = this.add.container(0, 0, [spinner, spinWheelNumbersContainer, ballContainer, spinnerFrame]);

    let spinButton = this.add.image(0, 0, 'spin-wheel-clicker').setDisplaySize(256, 256);
    let spinIcon = this.add.image(0, 0, 'spin-wheel-icon-disabled').setDisplaySize(160, 160);

    let spinButtonContainer = this.add.container(0, 0, [spinButton, spinIcon]);

    spinButton.setInteractive();
    spinButton.on('pointerdown', () => {this.handleSpinClick(centerX, centerY)});
    
    this.wheelContainer = this.add.container(centerX-400, centerY-60, [spinnerBackground, spinnerContainer, spinButtonContainer]);
  }

  setupChip(centerX, centerY) {
    let chipsValues = ["1", "10", "50", "100", "500", "1k", "10k"]
    for(let i = 0; i < 7; i++)
    {
      let chipName = "chip-"+(i+1);
      let chipImage = this.add.image(0, 0, chipName).setDisplaySize(90, 90);
      let chipText = this.add.text(0, 0, chipsValues[i], { 
        font: 'bold 36px Brothers-Bold', 
        fill: '#ffffff' 
      }).setOrigin(0.5);

      let chipContainer = this.add.container(centerX + 125 + (120 * i), 965, [chipImage, chipText]);
      chipContainer.setSize(90, 90);
      chipContainer.setInteractive();
      chipContainer.on('pointerdown', () => { this.selectChip(i); });
      this.chipSet.push(chipContainer);
    }

    this.selectChip(0);
  }

  setupBet(centerX, centerY) {
    let buttonName = [
      "black-2", "black-4", "black-6", "red-8", "red-10", "red-12",
      "red-1", "red-3", "red-5", "black-7", "black-9", "black-11",
      "text-1-6", "text-even", "empty-black", "empty-red", "text-odd", "text-7-12"
    ];

    let paytableText = this.add.image(centerX+750, centerY-275, 'text-paytable').setDisplaySize(112, 34);

    paytableText.setInteractive();
    paytableText.on('pointerdown', () => {this.showPaytable()});

    this.currentBetText = this.add.text(centerX+250, centerY-275, `Bet: ${currency.format(this.currentBet)} JFG`, { 
      font: '24px Inter-Regular', 
      fill: '#ffffff',
    }).setOrigin(0.5);
    
    let grid = this.add.image(centerX+480, centerY-60, 'grid').setDisplaySize(686, 344);
    this.betContainer = this.add.container(centerX+480, centerY-60);

    for(let i = 0; i < 18; i++)
    {
      let posX = (i%6 * 115) - 285;
      let posY = (Math.floor(i/6) * 115) - 115;
      let betButton = this.add.image(0, 0, buttonName[i]).setDisplaySize(90, 90);
      let chipOnBetButton = this.add.image(0, 0, "chip-1").setDisplaySize(80, 80).setOrigin(0.5).setVisible(false);
      let chipOnBetButtonText = this.add.text(0, 0, "0", { 
        font: 'bold 36px Brothers-Bold', 
        fill: '#ffffff' 
      }).setOrigin(0.5).setVisible(false);
      
      let betButtonGlow = this.add.image(0, 0, "golden-circle").setDisplaySize(90, 90).setVisible(false);

      betButton.setInteractive();
      betButton.on('pointerdown', () => this.addBet(i));
      
      let chipOnBetButtonContainer = this.add.container(posX, posY, [betButton, betButtonGlow, chipOnBetButton, chipOnBetButtonText]);
      
      this.betContainer.add(chipOnBetButtonContainer);
    }

    let clearButton = this.add.image(centerX+400, centerY+175, 'clear-button').setDisplaySize(134, 50);
    clearButton.setInteractive();
    clearButton.on('pointerdown', () => this.clearBet());
    
    let rebetButton = this.add.image(centerX+560, centerY+175, 'rebet-button').setDisplaySize(142, 50);
    rebetButton.setInteractive();
    rebetButton.on('pointerdown', () => this.reBet());
  }

  selectChip(i) {
    this.sound.unlock();
    var music = this.sound.add('bet');
    
		if (!this.sound.locked) {
			music.play();
		}
		else {  // IF Not wait on unlock event 
			this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
				music.play();
			})
		}

    let chipsValues = [1, 10, 50, 100, 500, 1000, 10000];
    for(let j = 0; j < this.chipSet.length; j++)
    {
      this.chipSet[j].y = 965;
    }

    this.selectedChip = chipsValues[i];
    this.chipSet[i].y -= 25;
  }
  
  addBet(i) {
    this.sound.unlock();
    var music = this.sound.add('bet');
    
		if (!this.sound.locked) {
			music.play();
		}
		else {  // IF Not wait on unlock event 
			this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
				music.play();
			})
		}

    let balance = this.balance_wallet;

    let balanceText = this.balanceText;

    if(this.isSpinning) return;
    if((balance - this.selectedChip) < 0) return;

    this.balance_wallet -= this.selectedChip;
    
    balanceText.setText(`${currency.format(balance)}`);

    this.currentBet += this.selectedChip;
    this.currentBetText.setText(`Bet: ${currency.format(this.currentBet)}`);

    this.betInfo[i] += this.selectedChip;

    let chipImageKey = '';

    if (this.betInfo[i] >= 1 && this.betInfo[i] < 10) {
      chipImageKey = 'chip-1';
    } else if (this.betInfo[i] >= 10 && this.betInfo[i] < 50) {
      chipImageKey = 'chip-2';
    } else if (this.betInfo[i] >= 50 && this.betInfo[i] < 100) {
      chipImageKey = 'chip-3';
    } else if (this.betInfo[i] >= 100 && this.betInfo[i] < 500) {
      chipImageKey = 'chip-4';
    } else if (this.betInfo[i] >= 500 && this.betInfo[i] < 1000) {
      chipImageKey = 'chip-5';
    } else if (this.betInfo[i] >= 1000 && this.betInfo[i] < 10000) {
      chipImageKey = 'chip-6';
    } else {
      chipImageKey = 'chip-7';
    }

    this.betContainer.getAt(i).getAt(2).setVisible(true);
    this.betContainer.getAt(i).getAt(2).setTexture(chipImageKey);
    this.betContainer.getAt(i).getAt(3).setVisible(true);
    this.betContainer.getAt(i).getAt(3).setText(this.betInfo[i]);

    let spinWheelIcon = this.wheelContainer.getAt(2).getAt(1);
    spinWheelIcon.setTexture("spin-wheel-icon");

    // this.tweens.add({
    //   targets: spinWheelIcon,
    //   duration: 3500,
    //   ease: 'Circ.easeOut',
    //   yoyo: false,
    //   repeat: 0
    // });

  }

  clearBet(returnMoney=true) {

    this.sound.unlock();
    var music = this.sound.add('bet');
    
		if (!this.sound.locked) {
			music.play();
		}
		else {  // IF Not wait on unlock event 
			this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
				music.play();
			})
		}


    if(returnMoney)
    {
      let totalBet = this.betInfo.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

      this.balance_wallet += totalBet;
      this.balanceTextJFU.setText(`${currency.format(this.balance_wallet)}`);
    }

    this.currentBet = 0;
    this.currentBetText.setText(`Bet: ${currency.format(this.currentBet)}`);

    this.betInfo = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for(let i = 0; i < this.betContainer.length; i++)
    {
      this.betContainer.getAt(i).getAt(2).setVisible(false);
      this.betContainer.getAt(i).getAt(3).setVisible(false);
    }

    this.wheelContainer.getAt(2).getAt(1).setTexture("spin-wheel-icon-disabled");
  }

  reBet() {
    this.sound.unlock();
    var music = this.sound.add('bet');
    
		if (!this.sound.locked) {
			music.play();
		}
		else {  // IF Not wait on unlock event 
			this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
				music.play();
			})
		}

    let currentSelectedChip = this.selectedChip;

    for(let i = 0; i < this.previousBetInfo.length; i++)
    {
      if(this.previousBetInfo[i] != 0)
      {
        this.selectedChip = this.previousBetInfo[i];
        this.addBet(i);
      }
    }

    this.selectedChip = currentSelectedChip
  }

  async handleSpinClick(centerX, centerY) {
    if(this.isSpinning) return;
    if(this.currentBet == 0) return;
    
    this.isSpinning = true;

    this.sound.unlock();
    var music = this.sound.add('spinning_sound');
    
		if (!this.sound.locked) {
			music.play();
		}
		else {
			this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
				music.play();
			})
		}

    const betKeys = [
      '2', '4', '6', '8', '10', '12', '1', '3', '5', '7', '9', '11', 'small', 'even', 'black', 'red', 'odd', 'big'
    ];
    
    const betObject = {};

    this.betInfo.forEach((value, index) => {
      if (value > 0) {
        const key = betKeys[index];
        betObject[key] = value;
      }
    });

    var response = await axios.post('https://game-api.j4u.app/mini-roulette/play', {
      currencyType: this.currentSelectedCurrency,
      bets: betObject
    },{
      headers: {
        authorization: `Bearer ${this.token}`
      }
    });

    if(!response.data.status)
    {
      alert(response.data.message);
      // switch(this.merchant)
      // {
      //   case 1:
      //   case "1":
      //     window.location.href = 'https://j4u.app';
      //     break;
      //   case 2:
      //   case "2":
      //     window.location.href = 'https://mkinternational.io';
      //     break
      // }
      return;
    }

    let angles = [0, 210, 300, 90, 60, 150, 270, 240, 30, 120, 330, 180];
    let targetNumber = response.data.data.number;
    let targetAngle = angles[targetNumber-1];
    let ballHolder = this.wheelContainer.getAt(1).getAt(2);
    let ball = this.wheelContainer.getAt(1).getAt(2).getAt(1);

    for(let i = 0; i < this.wheelContainer.getAt(1).getAt(1).length; i++)
    {
      this.wheelContainer.getAt(1).getAt(1).getAt(i).setAlpha(0);
    }

    for(let i = 0; i < this.betContainer.length; i++)
    {
      this.betContainer.getAt(i).getAt(1).setVisible(false);
    }

    ballHolder.setAngle(0);
    ball.setAngle(0);

    this.tweens.add({
      targets: ballHolder,
      angle: `+=${1800 + targetAngle}`,
      duration: 3500,
      ease: 'Circ.easeOut',
      yoyo: false,
      repeat: 0,
      onComplete: () => {
        this.isSpinning = false;
        this.previousBetInfo = this.betInfo;
        this.clearBet(false);

        this.wheelContainer.getAt(1).getAt(1).getAt(targetNumber-1).setAlpha(1);

        if (Number(response.data.data.amount) > 0)
        {
          this.sound.unlock();
          var music = this.sound.add('winning_sound');
          music.play();
          
          this.winningPanelContainer.setAlpha(1);
          this.winningPanelContainer.getAt(1).setText(currency.format(response.data.data.amount));

          this.time.delayedCall(3000, () => {
            this.tweens.add({
              targets: this.winningPanelContainer,
              alpha: 0,
              duration: 1000,
              ease: 'Circ.easeOut',
              yoyo: false,
              repeat: 0,
              onComplete: () => {
                this.winningPanelContainer.setAlpha(0);
              }
            });
          });

          let winningNumberIndex = betKeys.indexOf(String(response.data.data.number));
          this.betContainer.getAt(winningNumberIndex).getAt(1).setVisible(true);

          if(response.data.data.color == "red")
            this.betContainer.getAt(15).getAt(1).setVisible(true);
          else
            this.betContainer.getAt(14).getAt(1).setVisible(true);

          if(response.data.data.oddEven == "odd")
            this.betContainer.getAt(16).getAt(1).setVisible(true);
          else
            this.betContainer.getAt(13).getAt(1).setVisible(true);

          if(response.data.data.numSize == "small")
            this.betContainer.getAt(12).getAt(1).setVisible(true);
          else
            this.betContainer.getAt(17).getAt(1).setVisible(true);

          
          let balance = this.balance_wallet;
          let balanceText = this.balanceText;

          const initialBalance = balance;
          const finalBalance = balance + Number(response.data.data.amount);
          this.tweens.addCounter({
            from: initialBalance,
            to: finalBalance,
            duration: 1000,
            onUpdate: (tween) => {
              const currentBalance = tween.getValue();
              balanceText.setText(`${currency.format(currentBalance)}`);
            },
            onComplete: () => {
              balance = finalBalance;
              balanceText.setText(`${currency.format(finalBalance)}`);

              this.balance_wallet = balance;
            }
          });
        }
      }
    });

    this.tweens.add({
      targets: ball,  
      angle: `7200`,
      duration: 6000,
      ease: 'Circ.easeOut',
      yoyo: false,
      repeat: 0,
    });
  }

  showPaytable() {
    const spinning_sound = this.sound.add('bet');
    spinning_sound.play({loop: false});

    this.paytableGuideContainer.getAt(0).setVisible(!this.paytableGuideContainer.getAt(0).visible);
    this.paytableGuideContainer.getAt(1).setVisible(!this.paytableGuideContainer.getAt(1).visible);
    this.paytableGuideContainer.getAt(2).setVisible(!this.paytableGuideContainer.getAt(2).visible);

    if (this.paytableGuideContainer.getAt(0).visible) {
      this.paytableGuideContainer.getAt(0).setInteractive();
      this.paytableGuideContainer.getAt(0).input.enabled = true;
      this.paytableGuideContainer.getAt(1).setInteractive();
      this.paytableGuideContainer.setDepth(10);
      this.isPause = true;
    } else {
      this.paytableGuideContainer.getAt(0).setInteractive(false);
      this.paytableGuideContainer.getAt(0).input.enabled = false;
      this.paytableGuideContainer.getAt(1).setInteractive(false);
      this.paytableGuideContainer.setDepth(0);
      this.isPause = false;
    }
  }

  // changeSelectedCurrency(currencyName) {
  //   this.clearBet(true);
    
  //   this.currentSelectedCurrency = currencyName;

  //   switch(this.merchant)
  //   {
  //     case 1:
  //     case "1":
  //       this.JFUCoinOption.setTexture("JFU-default");
  //       this.JFGCoinOption.setTexture("JFG-default");
  //       if(currencyName == "JFU")
  //         this.JFUCoinOption.setTexture("JFU-selected");
  //       else
  //         this.JFGCoinOption.setTexture("JFG-selected");
  //       break;
  //     case 2:
  //     case "2":
  //       this.JFUCoinOption.setTexture("MKA-default");
  //       this.JFGCoinOption.setTexture("BP-default");
  //       if(currencyName == "MKA")
  //         this.JFUCoinOption.setTexture("MKA-selected");
  //       else
  //         this.JFGCoinOption.setTexture("BP-selected");
  //       break;
  //   }
  // }

  update() {
    if(!this.isPause)
    {
      this.wheelContainer.getAt(1).angle -= 0.25; 
      this.wheelContainer.getAt(2).getAt(0).angle += 0.25; 
    }
  }
}
