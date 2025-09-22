document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ calendar-init.js carregado');
  
    const calendarEl = document.getElementById('calendar');
    const modal = new bootstrap.Modal(document.getElementById('modalAppt'));
    const form  = document.getElementById('formAppt');
  
    /* ---------- FullCalendar ---------- */
    const calendar = new FullCalendar.Calendar(calendarEl, {
      locale: 'pt-br',
      buttonText: { today: 'Hoje', month: 'Mês', week: 'Semana', day: 'Dia' },
      initialView: 'timeGridWeek',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      slotMinTime: '08:00',
      slotMaxTime: '20:00',
      allDaySlot: false,
      selectable: true,
      select: info => openModal(info),
      events: '/appointments/json',
      eventClick: info => openModal(info)
    });
    calendar.render();
  
    /* ---------- abrir modal vazio ---------- */
    document.getElementById('btnNewAppt').onclick = () => openModal();
  
    function openModal(info) {
      form.reset();
      form._id.value = '';
      if (info?.startStr) {
        form.date.value = info.startStr.slice(0,10);
        form.time.value = info.startStr.slice(11,16);
      }
      modal.show();
    }
  
    /* ---------- salvar (SUBMIT) ---------- */
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      console.log('📤 enviando dados:', data);
  
      fetch('/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(res => {
        console.log('✅ resposta servidor:', res);
  
/* ---------- monta mensagem ---------- */
const phoneRaw = data.phone.replace(/\D/g, '');           // só dígitos
const ddd      = phoneRaw.length === 11 ? phoneRaw.slice(0, 2) : '27';
const numero   = phoneRaw.length === 11 ? phoneRaw.slice(2)    : phoneRaw;

const nome    = data.clientName.trim();
const dataFmt = new Date(data.date).toLocaleDateString('pt-BR');
const hora    = data.time;
const serv    = data.service;
const prof    = data.professional;

const msg =
  `Olá ${nome}! 😊%0A%0A` +
  `✅ Seu agendamento foi *confirmado*:%0A` +
  `📅 Data: *${dataFmt}* %0A` +
  `🕐 Horário: *${hora}* %0A` +
  `✂️ Serviço: *${serv}* %0A` +
  `💄 Profissional: *${prof}* %0A%0A` +
  `Obrigado e até lá!`;

/* ---------- abre WhatsApp Web ---------- */
window.open(`https://wa.me/55${ddd}${numero}?text=${msg}`, '_blank');
  
        modal.hide();
        calendar.refetchEvents();
      })
      .catch(err => console.error('❌ erro fetch:', err));
    });
  });