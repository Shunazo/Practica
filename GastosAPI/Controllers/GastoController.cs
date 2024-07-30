using GastosAPI.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CapaDatos;
using Azure.Messaging;

namespace GastosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class GastoController : ControllerBase
    {
        private readonly IGasto _gasto;
        private readonly IPersona _persona;
        private readonly ICategoria _categoria;
        public GastoController(IGasto gasto, IPersona persona, ICategoria categoria)
        {
            _gasto = gasto;
            _persona = persona;
            _categoria = categoria;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var gastos = _gasto.GetGastos();
            return Ok(gastos);
        }


       
        [HttpGet("{personanombre}", Name = "GetGastoPorPersona")]
        public IActionResult GetGastoPorPersona(string personanombre) 
        {
            var gasto = _gasto.GetGastosByPersona(personanombre);
            if (gasto == null)
            {
                return NotFound(); 
            }
            return Ok(gasto);
        }


        [HttpGet("{personanombre}/{categorianombre}", Name = "GetGastoPorPersonaYCategoria")]
        public IActionResult GetGastoPorPersonaYCategoria(string personanombre, string categorianombre)
        {
            var gasto = _gasto.GetGastosByPersonaYCategoria(personanombre, categorianombre);
            if (gasto == null)
            {
                return NotFound();
            }
            return Ok(gasto);
        }

        [HttpPost("{personanombre}/{categorianombre}")]
        public IActionResult Post(string personanombre, string categorianombre, [FromBody] Gasto gasto)
        {
            if (gasto == null)
            {
                return BadRequest("Gasto no válido");
            }

            if (string.IsNullOrEmpty(personanombre))
            {
                return BadRequest("Nombre de persona no especificado");
            }

            if (string.IsNullOrEmpty(categorianombre))
            {
                return BadRequest("Nombre de categoría no especificado");
            }

            // Check if the specified category exists for the given person
            var existingCategoria = _categoria.GetCategoriaByNameAndPersona(categorianombre, personanombre);
            if (existingCategoria == null)
            {
                return NotFound("La categoría especificada no existe para esta persona");
            }

            if (categorianombre != gasto.CategoriaNombre)
            {
                return BadRequest("El nombre de categoría en la ruta no coincide con el nombre de categoría en el cuerpo del mensaje");
            }

            // Assign the properties to the gasto object
            gasto.Id = 0; // Assuming Id should be reset to 0 for a new gasto

            try
            {
                _gasto.AddGasto(gasto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al agregar el gasto: {ex.Message}");
            }
        }


        [HttpPut("{personanombre}/{nombre}/{categorianombre}")]
        public IActionResult Put(string personanombre, string nombre, string categorianombre, [FromBody] Gasto gasto)
        {
            
            var existingGasto = _gasto.GetGastosByPersona(personanombre);
            if (existingGasto == null)
            {
                return BadRequest("Ese gasto no existe.");
            }

            if (gasto.Nombre != nombre)
            {
                return BadRequest("No se permite cambiar el nombre del gasto");
            }

           if (gasto.PersonaNombre != personanombre)
            {
                return BadRequest("Nombre mal escrito.");
            }

            if (gasto.CategoriaNombre != categorianombre)
            {
                return BadRequest("No se permite cambiar la categoria a la que pertenece el gasto");
            }

            _gasto.UpdateGasto(gasto);
            return NoContent();
        }

        [HttpDelete("{nombre}/{personanombre}")]
        public IActionResult Delete(string nombre, string personanombre)
        {
            
            _gasto.DeleteGasto(nombre, personanombre);
            return NoContent();
        }
    }
}
