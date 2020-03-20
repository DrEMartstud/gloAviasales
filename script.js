  const formSearch = document.querySelector('.form-search'),//форма поиска
    inputCitiesFrom = document.querySelector('.input__cities-from'),//поле ввода "Откуда"
    dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),//выпадающий список поля ввода "Откуда"
    inputCitiesTo = document.querySelector('.input__cities-to'),//поле ввода "Куда"
    dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),//выпадающий список поля ввода "Куда"
    inputDateDepart = document.querySelector('.input__date-depart');//поле "Дата вылета"
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
          return fixItem.includes(input.value.toLowerCase());
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
  }

  const renderCheapDay = (cheapTicket) => {

  };

  const renderCheapYear = (cheapTickets) => {
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
      from: city.find((item) => inputCitiesFrom.value === item.name).code,
      to: city.find((item) => inputCitiesTo.value === item.name).code,
      when: inputDateDepart.value
    };

    const requestData = 
      `?depart_date=${formData.when}` +
      `&origin=${formData.from}` +
      `&destination=${formData.to}` + 
      `&one_way=${true}` +
      `&token=${API_KEY}`;

    const requestData2 = '?depart_date=' + formData.when + 
      '&origin=' + formData.from +
      '&destination=' + formData.to + 
      '&one_way=' + 'true' +
      '&token=' + API_KEY;
    // console.log('requestData: ', requestData);

      getData(proxy + calendar + requestData, (response) => {//calendar priceApi
        renderCheap(response, formData.when);
      });

  })

  //вызовы функций
  //https://jsonplaceholder.typicode.com/photos
  //proxy + 
  getData(cityApi, (data) => {
    city = JSON.parse(data).filter(item => item.name);
    //console.log('city.code: ', city[55].code);
  });

  // getData(calendar + (getRequest), (data) => {
  //   console.log(JSON.parse(data));
  // });
