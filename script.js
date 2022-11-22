let sum = 0;
let addSum = 0;
const products = {
    action(e) {
      const target = e.target;
      if (target.classList.contains('products__action')) {
        const action = target.dataset.productsAction;
        const elemItem = target.closest('.products__item');
        if (action === 'deleted' && elemItem.dataset.productsState === 'deleted') {
          elemItem.remove();
        } else {
          elemItem.dataset.productsState = action;
          const lexicon = {
            active: 'восстановлено',
            completed: 'куплено',
            deleted: 'удалено'
          };
          const elProductsDate = elemItem.querySelector('.products__date');
          const html = `<span>${lexicon[action]}: ${new Date().toLocaleString().slice(0, -3)}</span>`;
          elProductsDate.insertAdjacentHTML('beforeend', html);
        }
        this.save();
      } else if (target.classList.contains('products__add')) {
        this.add();
        this.save();
      }
    },
    add() {
      const elemText = document.querySelector('.products__text');
      if (elemText.disabled || !elemText.value.length) {
        return;
      }
      const elemCost = document.querySelector('.productsCost__text');
      if (elemCost.disabled || !elemCost.value.length) {
        return;
      }
      document.querySelector('.products__items').insertAdjacentHTML('beforeend', this.create(elemText.value, elemCost.value));
      elemText.value = '';
      elemCost.value = '';
    },
    create(text, cost) {
      const date = JSON.stringify({ add: new Date().toLocaleString().slice(0, -3) });
      return `<li class="products__item" data-products-state="active">
        <div class="products__task">${text}</div>
          <div class="products__cost">${cost}</div>
          <div class="products__date" data-products-date="${date}">
            <div>добавлено: ${new Date().toLocaleString().slice(0, -3)}</div></div>
        <div class="products__actions products__action_restore" data-products-action="active"><i class="fa-solid fa-reply products__action products__action_restore" data-products-action="active"></i></div>
        <div class="products__actions products__action_complete" data-products-action="completed"><i class="fa-solid fa-check products__action products__action_complete" data-products-action="completed"></i></div>
        <div class="products__actions products__action_delete" data-products-action="deleted"><i class="fa-solid fa-trash products__action products__action_delete" data-products-action="deleted"></i></div></li>`;
    },
    init() {
      const fromStorage = localStorage.getItem('products');
      if (fromStorage) {
        document.querySelector('.products__items').innerHTML = fromStorage;
      }
      document.addEventListener('click', this.action.bind(this));
      this.sum();
    },
    update() {
      const option = document.querySelector('.products__options').value;
      document.querySelector('.products__items').dataset.productsOption = option;
      document.querySelector('.products__text').disabled = option !== 'active';
    },
    save() {
      localStorage.setItem('products', document.querySelector('.products__items').innerHTML);
      this.sum();
    },
    sum() {
        while(document.querySelector('.totalCost').firstChild) {
            document.querySelector('.totalCost').firstChild.remove();
        }
        sum = 0;
        addSum = 0;
        const products = document.querySelectorAll('.products__item');
        for(let item of products) {
            if(item.outerHTML.includes('data-products-state="completed"')) {
          sum += +item.firstElementChild.nextElementSibling.innerText;
            }
            else if (item.outerHTML.includes('data-products-state="active"')) {
                addSum += +item.firstElementChild.nextElementSibling.innerText;
            }
        }
        let totalCost = document.createElement('p');
        if (sum > 0) {
        totalCost.innerText = `Вы потратили уже ${sum} руб.(((((`;}
        else {
        totalCost.innerText = `Поздравляем! Вы не потратили ни рубля!)`;
        }
        document.querySelector('.totalCost').appendChild(totalCost);
        let addCost = document.createElement('p');
        if(addSum > 0) {
        addCost.innerText = `Вы собираетесь потратить ${addSum} руб.(((((`;}
        else {
            addCost.innerText = `Вы не собираетесь тратить деньги)`;}
        document.querySelector('.totalCost').appendChild(addCost);

    
  }
}
  products.init();
