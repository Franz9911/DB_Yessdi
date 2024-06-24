class Libro{
    constructor(idLibro,titulo, resumen, estado, categoria, costo,autor,imagenL) {
      this.idLibro = idLibro;
        this.titulo=titulo;
        this.resumen=resumen;
        this.estado = estado;
        this.categoria=categoria;
        this.costo=costo;
        this.autor=autor;
        this.imagenL=imagenL;
  }
  static fromJSON(json) {
    return new Libro(
        json.idLibro,
        json.titulo,
        json.resumen,
        json.estado,
        json.categoria,
        json.costo,
        json.autor,
        json.imagenL
    );
}


    toJSON() {
        return {
          idLibro:this.idLibro,
          titulo: this.titulo,
          resumen:this.resumen,
          estado:this.estado,
          categoria:this.categoria,
          costo:this.costo,
          autor:this.autor,
          imagenL:this.imagenL
        };
      }

}
module.exports = Libro;