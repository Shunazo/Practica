using CapaDatos;
using System.Collections.Generic;

namespace GastosAPI.Interfaces
{
    public interface IPersona
    {
        List<Persona> GetPersonas();
        Persona GetPersonaByUsuario(string usuario);
        void AddPersona(Persona persona);
        void UpdatePersona(Persona persona);
        void DeletePersona(string usuario);
    }
}

