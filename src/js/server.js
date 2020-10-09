
const { XMLHttpRequest } = require('xmlhttprequest');
const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');

const app = new Koa();
const now = new Date();

app.use(koaBody({
  urlencoded: true,
}));


const tickets = [];
tickets[0] = {
  id: 1,
  name: 'test',
  status: true,
  created: now,
};
tickets[1] = {
  id: 2,
  name: 'test2',
  status: true,
  created: now,
};
const ticketsFull = [];
ticketsFull[0] = {
  id: 1,
  name: 'test',
  status: true,
  created: 1,
  description: 'desc',
};
ticketsFull[1] = {
  id: 2,
  name: 'test2',
  status: true,
  created: 2,
  description: 'desc',
};


app.use(async (ctx) => {
  const { method } = ctx.request.query;
  switch (method) {
    case 'allTickets':
      ctx.response.body = tickets;
      ctx.response.status = 200;
      return;
    case 'ticketById':
      ctx.response.body = ticketsFull.find((el) => {
        if (el.id === ctx.request.query.id) return el;
        return false;
      });
      ctx.response.status = 200;
      return;
    case 'createTicket':
      tickets.push({
        id: ctx.request.query.id,
        name: ctx.request.query.name,
        status: ctx.request.query.status,
        created: ctx.request.query.created,
      });
      tickets.push({
        id: ctx.request.query.id,
        name: ctx.request.query.name,
        status: ctx.request.query.status,
        created: ctx.request.query.created,
        description: ctx.request.query.description,
      });
      ctx.response.body = tickets[tickets.length - 1];
      ctx.response.status = 200;
      return;
    default:
      ctx.response.body = 'error';
      ctx.response.status = 404;
  }
});

// eslint-disable-next-line no-unused-vars
const server = http.createServer(app.callback()).listen(7070);


function getMaxId() {
  const arr = [];
  tickets.forEach((element) => {
    arr.push(element.id);
  });
  return Math.max.apply(null, arr);
}


function postTicket(p) {
  // const formData = new FormData();
  // formData.append('id', getMaxId()+1);
  // formData.append('name', p.name);
  // formData.append('status', p.status);
  // formData.append('description', p.description),
  // formData.append('created', now);
  const params = new URLSearchParams();
  params.append('method', 'createTicket');
  params.append('id', getMaxId() + 1);
  params.append('name', p.name);
  params.append('status', p.status);
  params.append('description', p.description);
  params.append('created', now);
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `http://localhost:7070/?${params}`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(JSON.stringify(params));
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const data = JSON.parse(xhr.responseText);
      } catch (e) {
        console.error(e);
      }
    }
  });
}

function getTickets() {
  const params = new URLSearchParams();
  params.append('method', 'allTickets');
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `http://localhost:7070/?${params}`);
  xhr.send();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const data = JSON.parse(xhr.responseText);
      } catch (e) {
        console.error(e);
      }
    }
  });
}

function getTicketbyId(id) {
  const params = new URLSearchParams();
  params.append('method', 'ticketById');
  params.append('id', id);
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `http://localhost:7070/?${params}`);
  xhr.send();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const data = JSON.parse(xhr.responseText);
      } catch (e) {
        console.error(e);
      }
    }
  });
}
postTicket({
  name: 'test3',
  description: 'desc3',
  status: true,
});
getTickets();
getTicketbyId(1);
