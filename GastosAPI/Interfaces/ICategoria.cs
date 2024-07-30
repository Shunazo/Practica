
using CapaDatos;
using System.Collections.Generic;

namespace GastosAPI.Interfaces
{
    public interface ICategoria
    {
        List<Categoria> GetCategorias();
        List<Categoria> GetCategoriaByPersona(string personanombre);

        Categoria GetCategoriaByNameAndPersona(string categorianombre, string personanombre);
        void AddCategoria(Categoria categoria);
        void UpdateCategoria(Categoria categoria);
        void DeleteCategoria(string nombre, string personanombre);
    }
}
