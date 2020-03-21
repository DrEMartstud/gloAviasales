  const formSearch = document.querySelector('.form-search'),//форма поиска
    inputCitiesFrom = document.querySelector('.input__cities-from'),//поле ввода "Откуда"
    dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),//выпадающий список поля ввода "Откуда"
    inputCitiesTo = document.querySelector('.input__cities-to'),//поле ввода "Куда"
    dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),//выпадающий список поля ввода "Куда"
    inputDateDepart = document.querySelector('.input__date-depart'),//поле "Дата вылета"
    cheapestTicket = document.getElementById('cheapest-ticket'),
    otherCheapTickets = document.getElementById('other-cheap-tickets');

  //данные
  const cityApi = 'dataBase/cities.json',// 'http://api.travelpayouts.com/data/ru/cities.json',
    proxy = 'https://cors-anywhere.herokuapp.com/',
    API_KEY = '40e33d0750638c8e85ac9259f81a7b14',//токен
    calendar = 'http://min-prices.aviasales.ru/calendar_preload',
    priceApi = 'http://api.travelpayouts.com/v2/prices/nearest-places-matrix?',
    getRequest = '?origin=SVX&destination=KGD&depart_date=2020-09-19&one_way=true&token' + API_KEY; //Перелет из Екат (SVX) в Калининград (KGD) 25-05-2020


  let city = [],//массив городов
  cityCode = '';

  const getData = (url, callback) => {
    const request = new XMLHttpRequest();

    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
      if(request.readyState !== 4) return;

      if(request.status === 200) {
        callback(request.response);
      } else {
        console.error(request.status);
      }
    })

    request.send();
  };

  const showCity = (input, list) => {
      list.textContent = '';

      if (input.value !== '') {
      const filterCity = city.filter((item) => {
          const fixItem = item.name.toLowerCase();
          return fixItem.startsWith(input.value.toLowerCase());
      });

      filterCity.forEach((item) => {
        const li = document.createElement ('li');
        li.classList.add('dropdown__city');
        li.textContent = item.name;
        list.append(li)
      });
    }
  };

  const selectCity = (event, input, list) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
      input.value = target.textContent;
      list.textContent = '';
    }
  };

  const getNameCity = code => {
    const objCity = city.find( item => item.code === code);
    return objCity.name;
  }

  const getDate = date => {
    return new Date(date).toLocaleString('ru', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  const getChanges = num => {
    if(num) {
      return num === 1 ? 'С одной пересадкой' : 'Несколько пересадок';
    }else{
      return 'Без пересадок'
    }
  };

  const createCard = (data) => {
    const ticket = document.createElement('article');
    ticket.classList.add ('ticket');

    let deep = '';

    if (data) {
      deep = `
      <h3 class="agent">${data.gate}</h3>
      <div class="ticket__wrapper">
        <div class="left-side">
          <a href="https://www.aviasales.ru/search/SVX2905KGD1" class="button button__buy">Купить
            за ${data.value}₽</a>
        </div>
        <div class="right-side">
          <div class="block-left">
            <div class="city__from">Вылет из города
              <span class="city__name">${getNameCity(data.origin)}</span>
            </div>
            <div class="date">${getDate(data.depart_date)}</div>
          </div>

          <div class="block-right">
            <div class="changes">${getChanges(data.number_of_changes)}</div>
            <div class="city__to">Город назначения:
              <span class="city__name">${getNameCity(data.destination)}</span>
            </div>
          </div>
        </div>
      </div>
      `;
    } else {
      deep = '<h3>К сожалению на текущую дату билетов нет</h3>'
    }


    ticket.insertAdjacentHTML('afterbegin', deep);

    return ticket;
  };

  const renderCheapDay = (cheapTicket) => {
    cheapestTicket.style.display = 'block';
    cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';
    const ticket = createCard(cheapTicket[0]);
    cheapestTicket.append(ticket);
  };

  const renderCheapYear = (cheapTickets) => {
    otherCheapTickets.style.display = 'block';
    otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';
    cheapTickets.sort ((a,b) => a.value - b.value);
    // cheapTickets.sort ((a,b) => {
    //     if (a.value > b.value) {
    //     return 1;
    //   } if (a.value < b.value) {
    //     return - 1;
    //   }
    //   return 0;
    // })
    /*
    
    */
    console.log('cheapTickets: ', cheapTickets);
    //ДЗ сортировать по возрастанию
  };

  //ДЗ сортировать списки городов по возрастанию по первой букве

  const renderCheap = (data, date) => {
    const cheapTicketYear = JSON.parse(data).best_prices;
    // console.log('cheapTicketYear: ', cheapTicketYear);

    const cheapTicketDay = cheapTicketYear.filter((item) => {
      return item.depart_date === date;
    })
    // console.log('cheapTicketDay: ', cheapTicketDay);

    renderCheapDay(cheapTicketDay);
    renderCheapYear(cheapTicketYear);
  }

  //MVC: viewers (interface)
  inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom);
  });

  dropdownCitiesFrom.addEventListener('click',(event) => {
    selectCity(event, inputCitiesFrom, dropdownCitiesFrom);
  });

  inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo);
  });

  dropdownCitiesTo.addEventListener('click',(event) => {
    selectCity(event, inputCitiesTo, dropdownCitiesTo);
  });

  formSearch.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = {
      from: city.find((item) => inputCitiesFrom.value === item.name),
      to: city.find((item) => inputCitiesTo.value === item.name),
      when: inputDateDepart.value
    };

    if (formData.from && formData.to) {
      const requestData = 
        `?depart_date=${formData.when}` +
        `&origin=${formData.from.code}` +
        `&destination=${formData.to.code}` + 
        `&one_way=${true}` +
        `&token=${API_KEY}`;

      getData(calendar + requestData, (response) => {//calendar priceApi
        renderCheap(response, formData.when);
      });
    } else {
      alert('Введите корректное название города!');
    }

  });

  //вызовы функций
  //https://jsonplaceholder.typicode.com/photos
  //proxy + 
  getData(cityApi, (data) => {
    city = JSON.parse(data).filter(item => item.name);
    city.sort ((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
    //console.log('city.code: ', city[55].code);
  });

  // getData(calendar + (getRequest), (data) => {
  //   console.log(JSON.parse(data));
  // });
