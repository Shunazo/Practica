using GastosAPI.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CapaDatos;
using Azure.Messaging;

namespace GastosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonaController : ControllerBase
    {
        private readonly IPersona _persona;

        public PersonaController(IPersona persona)
        {
            _persona = persona;
        }

        // GET: api/Persona
        [HttpGet]
        public IActionResult Get()
        {
            var personas = _persona.GetPersonas();
            return Ok(personas);
        }

        // GET: api/Persona/5
        [HttpGet("{usuario}", Name = "GetPersona")]
        public IActionResult Get(string usuario)
        {
            var persona = _persona.GetPersonaByUsuario(usuario);
            if (persona == null)
            {
                return NotFound();
            }
            return Ok(persona);
        }



        // POST: api/Persona
        [HttpPost("registrar")]
        public IActionResult Post([FromBody] Persona persona)
        {
            if (persona == null)
            {
                return BadRequest("Persona no válida");
            }

            
            persona.Id = 0; // Establece el ID a 0 para asegurar que se genere automáticamente

            _persona.AddPersona(persona);
            return NoContent();
        }

        // POST: api/Persona/authenticate
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody] Persona personaLogin)
        {
            try
            {
                // Verificar las credenciales del usuario
                var persona = _persona.GetPersonaByUsuario(personaLogin.Usuario);

                // Comprobar si la persona existe y las credenciales son válidas
                if (persona != null && 
                    (persona.Email == personaLogin.Email || persona.Usuario == personaLogin.Usuario) && 
                    persona.Contrasena == personaLogin.Contrasena)
                {
                    // Autenticación exitosa
                    return Ok(new { Mensaje = "Inicio de sesión exitoso", Usuario = persona });
                }

                // Autenticación fallida
                return Unauthorized(new { Mensaje = "Credenciales inválidas" });
            }
            catch (Exception ex)
            {
                // Manejar cualquier error inesperado
                return StatusCode(500, new { Mensaje = "Error en el servidor", Error = ex.Message });
            }
        }
        

        // PUT: api/Persona/5
        [HttpPut("{usuario}")]
        public IActionResult Put(string usuario, [FromBody] Persona persona)
        {
           
            var existingPersona = _persona.GetPersonaByUsuario(usuario);
            if (existingPersona == null)
            {
                return NotFound();
            }

            // No permitir cambiar el nombre de usuario
            if (persona.Usuario != usuario)
            {
                return BadRequest("No se permite cambiar el nombre de usuario");
            }

            _persona.UpdatePersona(persona);
            return NoContent();
        }


        // DELETE: api/Persona/5
        [HttpDelete("{usuario}")]
        public IActionResult Delete(string usuario)
        {
            var existingPersona = _persona.GetPersonaByUsuario(usuario);
            if (existingPersona == null)
            {
                return NotFound();
            }

            _persona.DeletePersona(usuario);
            return NoContent();
        }
    }
}
