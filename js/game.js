"use strict";

//--------------------------------------------------
// Indholdsfortegnelse – data til Catch the Phisher
//--------------------------------------------------
// 1. Scenariedata (array med alle spillets scenarier)
// 2. Globale variabler (score, fejl, status)
// 3. Funktion: loadScenario() – indlæser og viser næste scenarie
// 4. Funktion: submitAnswer() – håndterer spillerens svar og viser feedback på dette
// 5. Funktion: nextScenario() – går videre til næste scenarie eller resultatside
// 6. Funktion: showResults() – viser resultater samt feedback på resultatsiden
// 7. DOMContentLoaded – initialiserer spillet afhængigt af hvilken side vi er på:
//    7.1. index.html – starter spillet og gemmer tilladelse til lyd
//    7.2. game.html – loader scenarier, håndterer svar, next-knapen og lyd
//    7.3. result.html – viser spillerens slutresultat
//--------------------------------------------------

const scenarios = [
  // array der indeholder et object for hvert scenarie, der er med i spillet
  {
    // objekt med data tilhørende scenarie #0
    title: "The Suspicious Email",
    description: "Welcome to the game! From now on, it's up to you to make the right choices and catch the phisher!",
    introLine: "Here's the deal:",
    text: "It's Monday afternoon. You just finished whatever you've been doing during the day and you're a bit tired. You're scrolling on the phone, when an email ticks in. It's from your bank, Nordic Bank, saying there was unauthorized activity on your account. The email urges you to click on a link to verify your identity. \n\n What do you do?", // spørgsmål til scenarie #1
    a: "Oh no, that sounds serious! I'd better click the link to check what's going on.", // svarmuligheder scenarie #0
    b: "Sounds bad! But let's double check the sender's email address first.", // svarmuligheder scenarie #0
    correct: "b", // korrekte svar til spørgsmål i scenarie #0
    explanationA: "You fell into the Phishers trap and clicked the link — and that could open a door to malware or a fake login page. Phishing emails often create panic to make you act fast. If you ever click something suspicious, here's what to do: Disconnect from the internet immediately and run a full virus scan offline. Change your passwords and back up your files. And remember: Real banks never ask you to verify through a link in an email.", // feedback hvis spilleren valgte a
    explanationB: "Great thinking! When double checking the email, you saw that the address said @3949robert@cbr.com - which clearly wasn't Nordic Bank! Phishing emails often come from addresses with typos or weird numbers. Real banks rarely email you, and when they do, it's usually via secure channels like your digital mailbox or their official app. A great reminder is to always double check before clicking anything.", // feedback for korrekt svar, b
  },
  {
    // objekt med data tilhørende scenarie #1
    title: "The Login Page …",
    text: "Curious, you clicked the link. The page looks identical to Nordic Bank's real site... logo, layout and there's even a chat function. But something's off: the URL says www.nordlcbank-support-verification.com. \n\n What do you do?", // spørgsmål til scenarie #1
    a: "Hmm... That URL looks suspicious. I'll compare it to Nordic Banks official one before doing anything else.", // svarmuligheder scenarie #1
    b: "It looks real enough. I'll enter my login to be safe.", // svarmuligheder scenarie #1
    correct: "a", // korrekt svar til spørgsmål i scenarie #1
    explanationA: "Phenomenal choice! Upon comparing the URL with Nordic Banks real URL, you saw that they weren't the same and therefore you reported it to your bank - and because of you they published a message warning all customers of a phishing attack. You rock! Phishing sites often mimic the real sites perfectly, but the URL almost always gives them away. A tiny change like a letter-combination can mean the difference between safety and danger. When in doubt, close the tab and type your bank's URL manually.", // feedback for korrekt svar, a
    explanationB: "Be careful! The page may look legit, but phishers use exact copies of real websites to trick you. The strange looking URL is a huge red flag. Entering your details here could give attackers full access to your account. Never trust a site just because it looks real! A great reminder is to always compare the an URL with another if in doubt.", // feedback hvis spilleren valgte b
    hint: "Hint: Never trust a URL that doesn't exactly match your bank's official domain. Type it manuall and compare if in doubt.", // hint som hjælp til at svare korrekt, kommer kun hvis der er svaret forkert på foregående spørgsmål
  },
  {
    // objekt med data tilhørende scenarie #2
    title: "The Follow-Up Phone Call",
    text: "You're a bit freaked out by the situation and all you want to is to make sure your account is safe. Minutes later, your phone rings. A calm voice says: “Hi there, this is Alex from Nordic Bank's fraud department. We've detected some unusual activity on your account. I just need to confirm your account and security code to secure it. \n\n What do you do?",
    a: "A real bank would never ask for sensitive info on the phone. I'm hanging up and calling them myself.", // svarmuligheder scenarie #2
    b: "I'm so happy they're calling me, that has to mean something has been going on. I'll give him the details to secure my account!", // svarmuligheder scenarie #2
    correct: "a", // korrekt svar til spørgsmål i scenarie #2
    explanationA: "Exactly right. Banks will never (as in never-ever!) ask for personal information like passwords, codes, or account numbers over the phone. If you ever receive a suspicious call, hang up and call your bank directly using a number from their official website. It's better to double check than to give out sensitive info right away.", // feedback for korrekt svar, a
    explanationB: "Unfortunately, this is exactly what the phishers wants you to think. They often create a sense of urgency and use fake names to sound legitimate. Just because they knew your name or recent activity doesn't mean they're real. Always remember: your bank already has your details. They won't call to ask for them.", // feedback hvis spilleren valgte b
    hint: "Hint: Legitimate banks never request personal info over the phone. Always hang up and call back via the number on your bank's website.", // hint som hjælp til at svare korrekt, kommer kun hvis der er svaret forkert på foregående spørgsmål
  },
  {
    // objekt med data tilhørende scenarie #3 - dette scenarie bliver kun vist, hvis der er svaret forkert på et af ovenstående scenarier
    title: "The Aftermath",
    text: "Because you previously shared your info on the fake page or over the phone, the phisher now has access to your account. You receive another message that looks like a follow-up from Nordic Bank, asking you to “confirm recovery” and click a link to prevent account deactivation. \n\n What do you do?",
    a: "Nope, I better click the link - I wouldn't want my account to be shut down!", // svarmuligheder scenarie #3
    b: "I've learned my lesson! I'll be reporting that email and I won't click another link.", // svarmuligheder scenarie #3
    correct: "b", // korrekt svar til spørgsmål i scenarie #3
    explanationA: "Noooo! This is how phishers strike again. Using a false sense of continuity to gain more trust. If you've already given them info, they'll know you're an easy target and a new attack could happen within a short amount of time. Never click links in suspicious emails, even if they reference previous conversations. Always verify with your bank directly.", // feedback hvis spilleren valgte a
    explanationB: "Yes! We're proud of you! If something feels off.. It probably is. Phishers often follow up on earlier scams, hoping to catch you off guard. It's awful, we know. Mark the email as spam, report it to your bank, and never click links from sources you don't fully trust.", // feedback for korrekt svar, b
    hint: "Hint: If you suspect you've been targeted, contact your bank through official channels. Never click follow-up links.", // hint som hjælp til at svare korrekt, kommer kun hvis der er svaret forkert på foregående spørgsmål
  },
];

// variabler til at tracke spillets gang
let currentScenario = 0; // hvilket scenarie vi er på
let score = 0; // spillerens score
let mistakes = 0; // antal fejl spilleren har
let aftermathShown = false; // hvorvidt scenarie #3 aftermath vises
let previousAnswerWasWrong = false; // hvorvidt svaret var korrekt ved foregående spørgsmål

function loadScenario() {
  // funktion som indlæser scenariet og viser dette på spillerens skærm
  const s = scenarios[currentScenario]; // henter objektet, scenariet
  let fullText = s.text;

  if (previousAnswerWasWrong && s.hint) {
    // hvis foregånede svar var forkert, hentes og vises hintet også
    fullText += "\n\n" + s.hint;
  }

  // opdaterer html-elementer med titel og tekst
  document.getElementById("scenario-title").innerText = s.title;
  document.getElementById("scenario-text").innerText = fullText;

  // viser intro-text og intro-line udelukkende i første scenarie
  const descEl = document.getElementById("intro-text");
  const introEl = document.getElementById("intro-line");
  if (currentScenario === 0) {
    descEl.innerText = s.description; // vis intro-tekst
    introEl.innerText = s.introLine; // vis intro-linen
    descEl.style.display = ""; // gør dem synlige
    introEl.style.display = "";
  } else {
    descEl.style.display = "none"; // gør dem usynlige for resterende scenarier
    introEl.style.display = "none";
  }

  // opdaterer de to knapper med svar-mulighederne for hvert scenarie
  document.getElementById("btn-a").innerText = s.a;
  document.getElementById("btn-b").innerText = s.b;
}

function submitAnswer(choice) {
  const s = scenarios[currentScenario]; // nuværende scenarie objekt
  const isCorrect = choice === s.correct; // boolean hvis spillerens svar matcher med det korrekte
  const popup = document.getElementById("feedback-popup"); // feedback/popup containeren
  const textEl = document.getElementById("feedback-text"); // teksten i feedback/popup containeren
  const overlay = document.getElementById("popup-overlay"); // baggrunden får et overlay når containeren vises
  const explanation = choice === "a" ? s.explanationA : s.explanationB;

  if (isCorrect) {
    score++; // scoren går op
    previousAnswerWasWrong = false; // intet forkert svar, derfor vises hintet ikke
    textEl.innerHTML = "<strong>Great job - you caught the Phisher!</strong><br><br>" + explanation; // vis korrekt + feedback
    popup.style.backgroundColor = "lightgreen"; // baggrundsfarven er grøn for at indikere succes
  } else {
    mistakes++; // antallet af fejl går op
    previousAnswerWasWrong = true; // forkert svar og derfor vises et hint ved næste scenarie
    textEl.innerHTML = "<strong>Oh no - the Phisher got you!</strong><br><br>" + explanation; // vis forkert + feedback
    popup.style.backgroundColor = "lightcoral"; // baggrundsfarven er rødlig for at indikere fejl
  }

  // viser popup
  popup.style.display = "block";
  overlay.style.display = "block";
}

function nextScenario() {
  // funktion, går videre til næste scenarie når spiller klikker "next"
  document.getElementById("feedback-popup").style.display = "none"; // gemmer popup igen
  document.getElementById("popup-overlay").style.display = "none";

  // efter scenarie #2: afgør om aftermath (scenarie #3) eller resultat skal vises
  if (currentScenario === 2) {
    // hvis der er begået fejl undervejs og scenarie #3 (aftermath endnu ikke er blevet vist)
    if (mistakes > 0 && !aftermathShown) {
      aftermathShown = true; // viser ekstrascenarie
      currentScenario = 3; // viser nuværende scenarie
      loadScenario(); // loader scenarie #3, the aftermath
      return; // resten af koden i funktionen skal ikke runnes
    } else {
      // ellers gemmes resultaterne, og resultatsiden vises
      const totalQs = aftermathShown ? 4 : 3; // bestemmer hvor mange spørgsmål der er talt, 3 hvis alle var korrekte og spilleren gik lige igennem - 4, hvis der var fejl undervejs og scenarie #4 har været vist
      localStorage.setItem("phishScore", score); // gemmer antal korrekte
      localStorage.setItem("phishMistakes", mistakes); // gemmer antal fejl
      localStorage.setItem("phishTotal", totalQs); // gemmer antallet af scenarier/spørgsmål som spilleren blev præsenteret for
      window.location.href = "result.html"; // navigerer browser til resultatsiden
      return;
    }
  }

  // hvis vi allerede er i scenarie #3, går vi altid direkte videre til resultatsiden
  if (currentScenario === 3) {
    localStorage.setItem("phishScore", score);
    localStorage.setItem("phishMistakes", mistakes);
    localStorage.setItem("phishTotal", 4);
    window.location.href = "result.html";
    return;
  }

  currentScenario++;
  loadScenario();
}

function showResults() {
  // funktion der viser resultatet af spillet, når vi befinder os på resultatsiden
  const finalScore = parseInt(localStorage.getItem("phishScore") || "0", 10); // henter gemt score
  const finalMistakes = parseInt(
    localStorage.getItem("phishMistakes") || "0",
    10
  ); // henter gemte fejl
  const totalQs = parseInt(localStorage.getItem("phishTotal") || "4", 10); // henter antal spørgsmål

  const resultEl = document.getElementById("result-message"); // beskeden med spillerens slutscore
  const infoEl = document.getElementById("result-info"); // mere dybdegående info/feedback om spillerens score

  // resultatbesked og feedback
  if (finalScore === totalQs && finalMistakes === 0) {
    resultEl.innerHTML = `<strong>Perfect! You caught all ${totalQs} phishers!</strong>`;
    infoEl.innerText = "That was awesome! You seem to be very well-informed about phishing-attacks - we couldn't be happier!\n\n";
  } else if (finalScore === totalQs - 1 && finalMistakes === 1) {
    resultEl.innerHTML = `<strong>Great job! You caught ${finalScore} out of ${totalQs}.</strong>`;
    infoEl.innerText = "Such a great job you did there! Almost perfect! Read the tips & tricks down below and your score will for sure be perfect nixe time!\n\n";
  } else {
    resultEl.innerHTML = `<strong>You caught ${finalScore} out of ${totalQs}.</strong>`;
    infoEl.innerText = "Great effort - keep practicing! And remember to always double check the sender's email address, URL spellings and never click any links from people wanting personal information.\n\n";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  // vent til html'en er færdigindlæst før vi kører koden
  const path = window.location.pathname; // viser hvilken side vi er på, kan eksempelvis være game.html eller result.html

  if (path.endsWith("index.html")) {
    const startButton = document.getElementById("startGame");
    if (startButton) {
      startButton.addEventListener("click", () => {
        localStorage.setItem("audioAllowed", "true");
        window.location.href = "game.html";
      });
    }
  }

  if (path.endsWith("game.html")) {
    // hvis vi er på game.html (altså spil-siden), load første scenarie og sæt spillet igang
    loadScenario(); // load scenarie med tekst osv som scenariet indeholder
    document
      .getElementById("btn-a")
      .addEventListener("click", () => submitAnswer("a")); // når spilleren klikker på a, process svar a
    document
      .getElementById("btn-b")
      .addEventListener("click", () => submitAnswer("b")); // når spilleren klikker på b, process svar b
    const nextBtn = document.getElementById("next-button");
    nextBtn.innerText = "Next"; // istedet for at knappen hedder next-button som koden siger, viser knappen nu kun teksten "Next"
    nextBtn.addEventListener("click", nextScenario); // når spilleren klikker på "Next" knappen bliver man ført videre til næste scenarie

    const bgSound = document.getElementById("bgSound");
    const soundToggle = document.getElementById("soundToggle");
    const iconOn = document.getElementById("icon-sound-on");
    const iconOff = document.getElementById("icon-sound-off");

    const audioAllowed = localStorage.getItem("audioAllowed") === "true";

    if (audioAllowed) { // hvis lyd er tilladt, starter musikken med fade-in effekt
      bgSound.muted = false;
      bgSound.volume = 0;
      bgSound.play().then(() => {
        localStorage.removeItem("audioAllowed");
        let fadeInterval = setInterval(() => {
          if (bgSound.volume < 1) {
            bgSound.volume = Math.min(bgSound.volume + 0.05, 1);
          } else {
            clearInterval(fadeInterval);
          }
        }, 100);
      }).catch(() => { // hvis autoplay fejler, vent på brugerinteraktion for at starte lyden
        document.addEventListener("click", () => {
          bgSound.muted = false;
          bgSound.play().catch(() => {});
        }, { once: true });
      });
    } else { // hvis brugeren ikke tidligere givet tilladelse, start lyden ved første klik
      document.addEventListener("click", () => {
        bgSound.muted = false;
        bgSound.play().catch(() => {});
      }, { once: true });
    }

    soundToggle.addEventListener("click", () => { // tilføjer funktionalitet til lydikonet
      bgSound.muted = !bgSound.muted;
      if (!bgSound.muted && bgSound.volume === 0) {
        bgSound.volume = 1;
      }
      iconOn.classList.toggle("hidden", bgSound.muted);
      iconOff.classList.toggle("hidden", !bgSound.muted);
    });
  }

  if (path.endsWith("result.html")) {
    showResults();
  }
});

  
  
