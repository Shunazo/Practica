using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace CapaDatos;

public partial class Categoria
{
    [JsonIgnore] // Evitar que se muestre la id en el request body del swagger pa que no eplote al crear una persona (la id se pone automaticamente en la base de datos)
    public int Id { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Descripcion { get; set; }

    public decimal MontoLimite { get; set; }

    public string PersonaNombre { get; set; } = null!;
}
