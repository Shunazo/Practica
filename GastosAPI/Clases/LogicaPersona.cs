using CapaDatos;
using GastosAPI.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GastosAPI.Clases
{
    public class LogicaPersona : IPersona
    {
        private DatosFinalDefinitivoContext context;

        public LogicaPersona(DatosFinalDefinitivoContext context)
        {
            this.context = context;
        }

        public List<Persona> GetPersonas()
        {
            return context.Personas.ToList();
        }

        public Persona GetPersonaByUsuario(string usuario)
        {
            return context.Personas.FirstOrDefault(p => p.Usuario == usuario);
        }

        public void AddPersona(Persona persona)
        {
            if (persona == null)
            {
                throw new ArgumentNullException(nameof(persona));
            }

            if (!Validator.EmailIsValid(persona.Email)) 
            {
                throw new ArgumentException("Email Invalido.");
            }

            persona.Id = 0;

            context.Personas.Add(persona);
            context.SaveChanges();
        }

        public void UpdatePersona(Persona persona)
        {
            var existingPersona = context.Personas
                .FirstOrDefault(p => p.Usuario == persona.Usuario);

            if (existingPersona != null)
            {
                if (!Validator.EmailIsValid(persona.Email))
                    // Validacion de email
                {
                    throw new ArgumentException("Email Invalido.");
                }

                existingPersona.Email = persona.Email;
                existingPersona.Contrasena = persona.Contrasena;

                context.SaveChanges();
            }
        }

        public void DeletePersona(string usuario)
        {
            var persona = context.Personas.FirstOrDefault(p => p.Usuario == usuario);

            if (persona != null)
            {
                context.Personas.Remove(persona);
                context.SaveChanges(); 
            }
        }
    }
}
