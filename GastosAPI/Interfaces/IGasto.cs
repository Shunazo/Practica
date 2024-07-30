using CapaDatos;
using System.Collections.Generic;

namespace GastosAPI.Interfaces
{
    public interface IGasto
    {
        List<Gasto> GetGastos();
        List<Gasto> GetGastosByPersona(string personanombre);
        List<Gasto> GetGastosByPersonaYCategoria(string personanombre, string categorianombre);
        void AddGasto(Gasto gasto);
        void UpdateGasto(Gasto gasto); 
        void DeleteGasto(string nombre, string personanombre);
    }
}
