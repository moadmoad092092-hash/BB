const form = document.querySelector('#chat-form');
const input = document.querySelector('#chat-input');
const messages = document.querySelector('#chat-messages');
const suggestions = document.querySelector('#suggestions');
const clearButton = document.querySelector('#clear-chat');

function addMessage(text, kind) {
  const row = document.createElement('div');
  row.className = `message ${kind}-message`;
  if (kind === 'assistant') {
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = '✳';
    row.appendChild(avatar);
  }
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  const time = document.createElement('time');
  time.textContent = new Intl.DateTimeFormat('ar', { hour: 'numeric', minute: '2-digit' }).format(new Date());
  bubble.append(paragraph, time);
  row.appendChild(bubble);
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
  return row;
}

function makeReply(question) {
  const q = question.toLowerCase();
  if (/مرحبا|مرحبًا|هلا|السلام عليكم|أهلًا|اهلا/.test(q)) return 'أهلًا وسهلًا! يسعدني نبدأ. وش الموضوع اللي تحب نتحدث عنه؟';
  if (/رسالة|اكتب|صياغة|مسودة/.test(q)) return 'أكيد. جرّب أن تبدأ بتحديد لمن تكتب، وما الفكرة الأساسية، والنبرة التي تريدها. مثلًا: «مرحبًا، حبيت أشاركك…». أعطني تفاصيل أكثر وأساعدك بصياغة مناسبة.';
  if (/اشرح|فكرة|بسيط|تعلم|أفهم/.test(q)) return 'خلّنا نبسّطها خطوة خطوة: اكتب اسم الفكرة أو الجزء الذي يحيرك، وسأحاول شرحه بمثال واضح. هل تفضّل شرحًا مختصرًا أم تفصيليًا؟';
  if (/مشروع|أفكار|أرتب|خطة|ابدأ/.test(q)) return 'لبداية مرتبة، اكتب هدفك بجملة واحدة، ثم دوّن: لمن هذه الفكرة؟ ما أول خطوة صغيرة؟ وما الشيء الذي تحتاج معرفته قبلها؟ شاركني فكرتك ونرتّبها معًا.';
  if (/شكرا|شكرًا|ممتاز/.test(q)) return 'العفو! إذا ودّك، نقدر نكمل من هنا أو نجرّب زاوية ثانية للموضوع.';
  return 'وصلني سؤالك. هذه نسخة تجريبية محلية، لذلك لا أملك اتصالًا بنموذج ذكاء اصطناعي ولا أستطيع توليد إجابة حقيقية لكل سؤال. لكن اكتب لي هل تريد مساعدة في الكتابة أو ترتيب الأفكار أو شرح موضوع، وسأقترح لك نقطة بداية.';
}

function send(text) {
  const value = text.trim();
  if (!value) return;
  if (suggestions.isConnected) suggestions.remove();
  addMessage(value, 'user');
  input.value = '';
  input.style.height = 'auto';
  const typing = addMessage('يفكّر…', 'assistant');
  typing.querySelector('p').classList.add('typing');
  window.setTimeout(() => {
    typing.remove();
    addMessage(makeReply(value), 'assistant');
  }, 500);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  send(input.value);
});
input.addEventListener('input', () => {
  input.style.height = 'auto';
  input.style.height = `${Math.min(input.scrollHeight, 100)}px`;
});
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});
document.querySelectorAll('[data-prompt]').forEach((button) => {
  button.addEventListener('click', () => send(button.dataset.prompt));
});
clearButton.addEventListener('click', () => {
  messages.innerHTML = '';
  const welcome = addMessage('أهلًا! أنا رِواق. وش تحب نسوي اليوم؟ اسألني، أو اختر بداية من الاقتراحات.', 'assistant');
  welcome.querySelector('time').textContent = 'الآن';
  messages.appendChild(suggestions);
  input.value = '';
  input.focus();
});
