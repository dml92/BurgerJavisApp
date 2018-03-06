import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController,
  AlertController, PopoverController } from 'ionic-angular';

import { Order } from '../../app/order';
import { OrderItem } from '../../app/order-item';
import { OrderState } from '../../app/commons';
import { OrderService } from '../../app/order.service';
import { ProductService } from '../../app/product.service';
import { PopoverListComponent } from './popover-list.component';


@Component({
  templateUrl: 'order-details.component.html'
})
export class OrderDetailsComponent {

  order: Order;
  modified : boolean = false;

  constructor(
  	private navCtrl: NavController,
  	private navParams: NavParams,
  	private popoverCtrl: PopoverController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private orderService: OrderService,
    private productService: ProductService) {

  	this.order = this.navParams.get('order');

  }

  increaseAmount(item: OrderItem) {
    this.modified = true;
    item.amount += 1;
  }

  decreaseAmount(item: OrderItem) {
    this.modified = true;
    item.amount -= 1;
    if(item.amount === 0) {
      let index = this.order.items.indexOf(item);
      if (index => 0) {
        this.order.items.splice(index , 1);
      }
    }
  }

  addProduct() {
    let localList = [];

    let loading = this.loadingCtrl.create({
      content: "Cargando productos..."
    });
    loading.present();

    this.productService.getProductList()
      .then(products => {
        loading.dismiss();
        if(this.order.items.length) {
          for (let i=0; i<products.length; i++) {
            let found = false;
            let j=0;
            while(!found && j<this.order.items.length) {
              found = products[i]===this.order.items[j].product;
              j++;
            }
            if(!found) {
              localList.push(products[i]);
            }
          }
        } else {
          localList = products;
        }
        let popover = this.popoverCtrl.create(
          PopoverListComponent, {products: localList, order: this.order});
        popover.present();
        this.modified = true;
      })
      .catch(() => {
        loading.dismiss();
        let toast = this.toastCtrl.create({
          message: 'Error al obtener la lista de productos',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      });
  }

  deleteOrder() {
    let confirm = this.alertCtrl.create({
      title: '¿Borrar ' + this.order.name + '?',
      message: '¿Estás seguro de que quieres eliminar este pedido? ' +
        'Se perderá toda la información relacionada con este pedido...',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            // No further action
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.removeOrder();
          }
        }
      ]
    });
    confirm.present();
  }

  finishOrderConfirmation () {
    let confirm = this.alertCtrl.create({
      title: '¿Finalizar este pedido?',
      message: '¿Estás seguro de que quieres finalizar este pedido? ' +
        'Una vez hecho, no se podrán hacer modificaciones sobre el mismo',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            // No further action
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.order.state = OrderState.FINISHED;
            this.updateOrder(true);
          }
        }
      ]
    });
    confirm.present();
  }

  sendToKitchenConfirmation () {
    let confirm = this.alertCtrl.create({
      title: '¿Enviar a cocina?',
      message: 'Una vez hecho, no se podrán hacer modificaciones sobre el mismo',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            // No further action
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.order.state = OrderState.KITCHEN;
            this.updateOrder(true);
          }
        }
      ]
    });
    confirm.present();
  }

  /** Update order */
  updateOrder(closeOrder: boolean = false) {
    let loading = this.loadingCtrl.create({
      content: "Actualizando pedido..."
    });
    loading.present();
    this.orderService.updateOrder(this.order)
      .then(() => {
        loading.dismiss();
        this.modified = false;
        if(closeOrder) {
          this.navCtrl.popToRoot();
        }
      })
      .catch(err => {
        let toast = this.toastCtrl.create({
          message: 'Error al actualiar el pedido',
          duration: 3000,
          position: 'bottom'
        });
        loading.dismiss();
        toast.present();
      });
  }

  removeOrder() {
    let loading = this.loadingCtrl.create({
      content: "Borrando pedido..."
    });
    loading.present();
    this.orderService.removeOrder(this.order)
      .then(() => {
        loading.dismiss();
        this.navCtrl.popToRoot();
      })
      .catch(() => {
        loading.dismiss();
        let toast = this.toastCtrl.create({
          message: 'Error al borrar el pedido',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      });
  }

  isFinished(order: Order): boolean {
    let value = OrderState[order.state];
    return value == OrderState.FINISHED.toString();
  }

  isInitial(order: Order): boolean {
    let value = OrderState[order.state];
    return value == OrderState.INITIAL.toString();
  }

  isServed(order: Order): boolean {
    let value = OrderState[order.state];
    return value == OrderState.SERVED.toString();
  }

  isKitchen(order: Order): boolean {
    let value = OrderState[order.state];
    return value == OrderState.KITCHEN.toString();
  }

}