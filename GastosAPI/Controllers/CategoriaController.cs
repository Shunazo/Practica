using GastosAPI.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CapaDatos;
using Azure.Messaging;

namespace GastosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriaController : ControllerBase
    {
        private readonly ICategoria _categoria;

        public CategoriaController(ICategoria categoria)
        {
            _categoria = categoria;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var categorias = _categoria.GetCategorias();
            return Ok(categorias);
        }

        [HttpGet("{personanombre}", Name = "GetCategoriaPorPersona")]
        public IActionResult GetCategoriaByPersona(string personanombre)
        {
            var categoria = _categoria.GetCategoriaByPersona(personanombre);
            if (categoria == null)
            {
                return NotFound();
            }
            return Ok(categoria);
        }


        [HttpPost("{personanombre}")]
        public IActionResult Post(string personanombre, [FromBody] Categoria categoria)
        {

            var existingCategoria = _categoria.GetCategoriaByPersona(personanombre);
            if (existingCategoria == null)
            {
                return NotFound();
            }

            if (categoria == null)
            {
                return BadRequest("Categoria No valida");
            }

            categoria.Id = 0;

            _categoria.AddCategoria(categoria);
            return NoContent();
        }

        [HttpPut("{nombre}/{personanombre}")]
        public IActionResult Put(string nombre, string personanombre, [FromBody] Categoria categoria)
        {
            var existingCategoria = _categoria.GetCategoriaByPersona(personanombre);
            if (existingCategoria == null)
            {
                return NotFound();
            }

            if (categoria.Nombre != nombre)
            {
                return BadRequest("No se permite cambiar el nombre de la categoria");
            }

            if (categoria.PersonaNombre != personanombre)
            {
                return BadRequest("No se permite cambiar el propietario de la categoria");
            }

            _categoria.UpdateCategoria(categoria);
            return NoContent();
        }

        [HttpDelete("{nombre}/{personanombre}")]
        public IActionResult Delete(string nombre, string personanombre)
        {
            _categoria.DeleteCategoria(nombre, personanombre);
            return NoContent();
        }



    }

}