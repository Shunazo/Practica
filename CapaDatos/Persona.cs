using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace CapaDatos;

public partial class Persona
{
    [JsonIgnore] // Evitar que se muestre la id en el request body del swagger pa que no eplote al crear una persona (la id se pone automaticamente en la base de datos)
    public int Id { get; set; }

    public string Usuario { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Contrasena { get; set; } = null!;
}
