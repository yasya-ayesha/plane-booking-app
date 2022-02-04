import { setStorage, getStorage } from "../service/storage.js";
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
    textContent: 'Подтвердить',
    disabled: true
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

const createBlockSeat = (n, count, bookingSeat) => {
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
      const seatNumber = `${i}${letter}`;
      const check = createElement('input', {
        name: 'seat',
        type: 'checkbox',
        value: seatNumber,
        disabled: bookingSeat.includes(seatNumber)
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

const createAirplane = (title, tourData, bookingSeat) => {
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
      const blockSeat = createBlockSeat(n, type, bookingSeat);
      n = n+type;
      return blockSeat;
    }
  });
  plane.append(cockpit, ...elements);
  choicesSeat.append(plane);

  return choicesSeat;
};

const checkSeat = (form, data, main, id, booked) => {
  form.addEventListener('change', () => {
    const formData = new FormData(form);
    const checked = [...formData].map(([, value]) => value);
    const okBtn = document.querySelector('.cockpit-confirm');
    if (checked.length === data.length) {
      okBtn.disabled = false;
      [...form].forEach(item => {
        if (!item.checked && item.name === 'seat') {
          item.disabled = true;
        }
      });
    } else {
      okBtn.disabled = true;
      [...form].forEach(item => {
        if (!booked.includes(item.value)) {
          item.disabled = false;
        }
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

    setStorage(id, data);

    form.remove();
    const thanks = createElement('h1', {
      textContent: `Спасибо, хорошего полёта`,
      className: 'title'
    });
    const message = createElement('h2', {
      textContent: `${booking.length === 1 ? `Ваше место - ${booking}` : `Ваши места - ${[...booking]}`}`,
      className: 'title'
    });
    main.append(thanks, message);
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
  const bookingSeat = getStorage(tourData.id).map(item => item.seat);
  const choiceForm = createAirplane(title, tourData, bookingSeat);
  main.append(choiceForm);
  checkSeat(choiceForm, data, main, tourData.id, bookingSeat);
};

export default airplane; 