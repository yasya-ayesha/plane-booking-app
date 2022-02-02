import createElement from "./createElement.js";

const createFormPerson = (index) => {
  const form = createElement('form', {
    className: 'person'
  });
  
  const title = createElement('h2', {
    className: 'person__title',
    textContent: `Пассажир #${index+1}`
  });

  const fieldName = createElement('div', {
    className: 'field'
  });
  const labelName = createElement('label', {
    className: 'field__label',
    textContent: 'ФИО',
    for: `name${index}`
  });
  const fieldInput = createElement('input', {
    className: 'field__input',
    id: `name${index}`,
    name: 'name',
    type: 'text',
    placeholder: 'Введите ваше ФИО',
    required: true
  });
  fieldName.append(labelName, fieldInput);

  const fieldTicket = createElement('div', {
    className: 'field'
  });
  const labelTicket = createElement('label', {
    className: 'field__label',
    textContent: 'Номер билета (10 цифр)',
    for: `ticket${index}`
  });
  const inputTicket = createElement('input', {
    className: 'field__input',
    id: `ticket${index}`,
    name: 'ticket',
    type: 'text',
    placeholder: 'Номер билета',
    required: true,
    minLength: 10,
    maxLength: 10
  })
  fieldTicket.append(labelTicket, inputTicket);

  const button = createElement('button', {
    className: 'btn-confirm',
    type: 'submit',
    textContent: 'Подтвердить'
  })

  form.append(title, fieldName, fieldTicket, button);

  return form;
};

const getFormPerson = (number) => {
  const forms = [];
  if (number > 6) number = 6;
  for (let i = 0; i < number; i++) {
    forms.push(createFormPerson(i));
  }
  return forms;
};

export default getFormPerson;