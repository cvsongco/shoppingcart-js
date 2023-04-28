const PRICING_RULES = {
    'ult_small': {
      name: 'Unlimited 1GB',
      price: 24.90
    },
    'ult_medium': {
      name: 'Unlimited 2GB',
      price: 29.90
    },
    'ult_large': {
      name: 'Unlimited 5GB',
      price: 44.90
    },
    '1gb': {
      name: '1 GB Data pack',
      price: 9.90
    }
  };
  class ShoppingCart {
    constructor(pricingRules) {
      this.items = [];
      this.promoCode = "";
      this.pricingRules = pricingRules;
      this.itemCounts = {};
    }
  
    add(item, promoCode = "") {
        if (!this.pricingRules[item]) {
          throw new Error(`Invalid product code: ${item}`);
        }
        this.items.push(item);
        if (this.itemCounts[item]) {
          this.itemCounts[item]++;
        } else {
          this.itemCounts[item] = 1;
        }
        if(!this.promoCode || promoCode) {
            this.promoCode = promoCode;
        }
      }
      
  
    getDiscountedPrice(item, quantity, excessDataPack) {
        let price = this.pricingRules[item].price;
        let excess1gb = excessDataPack;
        let discountedPrice = price;
        switch (item) {
          case "ult_small":
            if (quantity >= 3) {
              let freeItemsCount = Math.floor(quantity / 3);
              discountedPrice = (quantity * price) - (freeItemsCount * price);
            } else {
                discountedPrice = quantity * price;
            }
            break;
          case "ult_medium":
            discountedPrice = quantity * price
            break;
          case "ult_large":
            if (quantity >= 3) {
                discountedPrice = quantity * 39.9;
              } else {
                discountedPrice = quantity * price;
              }
            break;
            case "1gb":
                if (excess1gb > 0) {
                    discountedPrice = excess1gb * price;
                } else {
                    discountedPrice = 0;
                }
                break;
          default:
            break;
        }
        return discountedPrice;
      }
  
      calculateTotal() {
        let total = 0;
        let itemCounts = {};
        let itemCountsWithoutPromo = {};
        let excessDataPack = 0;
        this.items.forEach((item) => {
          if (itemCounts[item]) {
            itemCounts[item]++;
          } else {
            itemCounts[item] = 1;
          }

        });

        for (let item in itemCounts) {
          let quantity = itemCounts[item];
          if(itemCounts['1gb'] > itemCounts['ult_medium']) {
            excessDataPack = itemCounts['1gb'] - itemCounts['ult_medium'];
          }
          let discountedPrice = this.getDiscountedPrice(item, quantity, excessDataPack);
          let price = this.pricingRules[item].price;
          total += discountedPrice;
        }
        if (this.promoCode === "I<3AMAYSIM" && this.promoCode) {
          total *= 0.9;
        }
        let toAdd1gb = itemCounts['ult_medium'] - itemCounts['1gb']
        if((toAdd1gb>0)) {
            for (let i = 0; i < toAdd1gb; i++) {
                this.add('1gb');
            }
        }

        return { total: total.toFixed(2)};
      }
      
  }
  
  
console.log("Scenario 1:")
const cart1 = new ShoppingCart(PRICING_RULES);

cart1.add('ult_small');
cart1.add('ult_small');
cart1.add('ult_small');
cart1.add('ult_large');

console.log(cart1.calculateTotal()); // 94.70
console.log(cart1.items); 
//cart1.add('ult_large', 'I<3AMAYSIM');

console.log("Scenario 2:")
const cart2 = new ShoppingCart(PRICING_RULES);

cart2.add('ult_large');
cart2.add('ult_small');
cart2.add('ult_large');
cart2.add('ult_small');
cart2.add('ult_large');
cart2.add('ult_large');

console.log(cart2.calculateTotal()); // 209.40
console.log(cart2.items); 

console.log("Scenario 3:")
const cart3 = new ShoppingCart(PRICING_RULES);

cart3.add('ult_medium');
cart3.add('ult_medium');
cart3.add('ult_small');

console.log(cart3.calculateTotal()); // 84.70
console.log(cart3.items); 

console.log("Scenario 4:")
const cart4 = new ShoppingCart(PRICING_RULES);

cart4.add('ult_small');
cart4.add('1gb', 'I<3AMAYSIM');

console.log(cart4.calculateTotal()); // 31.32
console.log(cart4.items); 

console.log("Scenario 5:")
const cart5 = new ShoppingCart(PRICING_RULES);

cart5.add('ult_medium');
cart5.add('ult_medium');
cart5.add('1gb');
cart5.add('ult_medium');
cart5.add('ult_small');

console.log(cart5.calculateTotal()); // 114.60
console.log(cart5.items); 

console.log("Scenario 6:")
const cart6 = new ShoppingCart(PRICING_RULES);

cart6.add('1gb');
cart6.add('ult_medium');
cart6.add('1gb');
cart6.add('ult_medium');
cart6.add('1gb');
cart6.add('ult_small');

console.log(cart6.calculateTotal()); // 94.60
console.log(cart6.items); 