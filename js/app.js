//variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}

//clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
        
    }
    calcularRestante() {
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0  );
        this.restante = this.presupuesto - gastado;

    }
    eliminarGasto(id) {
        this.gastos = this.gastos.filter( gasto => gasto.id !== id );
        this.calcularRestante();
        console.log(this.gastos)
    }
}

class UI {
    insertarPresupuesto( cantidad ) {
        //extrayendo los valores
        const { presupuesto, restante } =  cantidad;
        //agregar al HTML

        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        // Crea el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        // Si es de tipo error agrega una clase
        if(tipo === 'error') {
             divMensaje.classList.add('lert-danger');
        } else {
             divMensaje.classList.add('alert-success');
        }
        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el DOM
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        // Quitar el alert despues de 3 segundos
        setTimeout( () => {
             document.querySelector('.primario .alert').remove();
        }, 3000);
   }
    mostrarGastos(gastos) {
        this.limpiarHTML();//elimina el HTML previo
        //Iterar sobre los gastos
        gastos.forEach( gasto => {
            const { cantidad, nombre, id } = gasto;

            //crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.setAttribute('data-id', id);
            nuevoGasto.dataset.id = id;
            //agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>`;

            //Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.textContent = 'Borrar'
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);
            // agregar el HTML

            gastoListado.appendChild(nuevoGasto);
        })
   } 
   limpiarHTML() {
        while( gastoListado.firstChild ) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
   }
   actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
   } 
   comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        //comprobar 25%
        if( (presupuesto / 4) > restante ) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if( (presupuesto / 2) > restante ) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }


        //si el total es 0 o menor
        if( restante <= 0 ) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disable = true;
        }
   }
}
//instanciar
const ui = new UI();
let presupuesto;

//funciones
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');

    console.log(presupuestoUsuario)
    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0  ) {
        window.location.reload();
    }
    //presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e) {
    e.preventDefault();
    //leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //validar
    if(nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if ( cantidad <= 0 || isNaN(cantidad) ) {
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return;
    }
    //generar un objeto con el gasto
    const gasto = { nombre, cantidad, id: Date.now() }

    //añade un nuevo gasto
    presupuesto.nuevoGasto( gasto );
    
    ui.imprimirAlerta('Gasto agregado correctamente')

    //imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    //reinicia el formulario
    formulario.reset();
}

function eliminarGasto(id) {
    //elimina del objeto
    presupuesto.eliminarGasto(id);
    //elimina los gastos del HTML
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}