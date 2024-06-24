// Reserva.js
class Reserva {
    constructor( idReserva,idLibro, idUsuario, fechaReserva, estado,unidades,costo, fechaResecion,imagenL,titulo) {
      this.idReserva=idReserva;
      this.idLibro = idLibro;
      this.idUsuario = idUsuario;
      this.fechaReserva = fechaReserva;
      this.estado = estado;
      this.unidades = unidades;
      this.costo = costo;
      this.fechaResecion = fechaResecion;
      this.imagenL=imagenL;
      this.titulo=titulo;
    }
  
    static fromJSON(json) {
      return new Reserva(
        json.idReserva,
        json.idLibro,
        json.idUsuario,
        json.fechaReserva,
        json.estado,
        json.unidades,
        json.costo,
        json.fechaResecion,
        json.imagenL,
        json.titulo
      );
    }
  
    toJSON() {
      return {
        idReserva: this.idReserva,
        idLibro: this.idLibro,
        idUsuario: this.idUsuario,
        fechaReserva: this.fechaReserva,
        estado: this.estado,
        unidades: this.unidades,
        costo: this.costo,
        fechaResecion: this.fechaResecion,
        imagenL:this.imagenL,
        titulo:this.titulo
      };
    }
  }
  
  module.exports = Reserva;