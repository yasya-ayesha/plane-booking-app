import createElement from "./createElement.js";

const createCockpit = (title) => {
  const cockpit = createElement('div', {
    className: 'cockpit'
  });
  const h1 = createElement('h1', {
    className: 'cockpit-title',
    textContent: title
  });
  const button = createElement('button', {
    className: 'cockpit-confirm',
    type: 'submit',
    textContent: 'Подтвердить'
  });
  cockpit.append(h1, button);

  return cockpit;
};

const createExit = () => {
  const fuselage = createElement('div', {
    className: 'fuselage exit'
  });
  return fuselage;
};

const createBlockSeat = (n, count) => {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const fuselage = createElement('ol', {
    className: 'fuselage'
  });
  for (let i = n; i < count+n; i++) {
    const row = createElement('li');
    const seats = createElement('ol', {
      className: 'seats'
    });

    const seatsRow = letters.map(letter => {
      const seat = createElement('li', {
        className: 'seat'
      });
      const wrapperCheck = createElement('label', {
      });
      const check = createElement('input', {
        name: 'seat',
        type: 'checkbox',
        value: `${i}${letter}`
      });
      wrapperCheck.append(check);
      seat.append(wrapperCheck);
      return seat;
    });

    seats.append(...seatsRow);
    row.append(seats);
    fuselage.append(row);
  }
  return fuselage; 
};

const createAirplane = (title, tourData) => {
  const scheme = tourData.scheme;
  const choicesSeat = createElement('form', {
    className: 'choices-seat'
  });
  const plane = createElement('fieldset', {
    className: 'plane',
    name: 'plane'
  });
  const cockpit = createCockpit(title);
  let n = 1;
  const elements = scheme.map((type) => {
    if (type === 'exit') {
      return createExit();
    }
    if (typeof type === 'number') {
      const blockSeat = createBlockSeat(n, type);
      n = n+type;
      return blockSeat;
    }
  });
  plane.append(cockpit, ...elements);
  choicesSeat.append(plane);

  return choicesSeat;
};

const checkSeat = (form, data, main) => {
  form.addEventListener('change', () => {
    const formData = new FormData(form);
    const checked = [...formData].map(([, value]) => value);
    if (checked.length === data.length) {
      [...form].forEach(item => {
        if (!item.checked && item.name === 'seat') {
          item.disabled = true;
        }
      });
    } else {
      [...form].forEach(item => {
        item.disabled = false;
      });
    }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const booking = [...formData].map(([, value]) => value);
    for (let i = 0; i < data.length; i++) {
      data[i].seat = booking[i];
    }
    console.log(data);
    form.remove();
    const message = createElement('h2', {
      textContent: `Спасибо хорошего полёта, ваши места: ${[...booking]}`
    });
    main.append(message);
  });
};

const airplane = (main, data, tourData) => {
  let title = '';
  if (data.length === 1) {
    title = 'Выберите 1 место';
  } else if (data.length > 1 && data.length < 5) {
    title = `Выберите ${data.length} места`;
  } else {
    title = `Выберите ${data.length} мест`;
  }
  const choiceForm = createAirplane(title, tourData);
  main.append(choiceForm);
  checkSeat(choiceForm, data, main);
};

export default airplane; 