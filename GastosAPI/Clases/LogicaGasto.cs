using CapaDatos;
using GastosAPI.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GastosAPI.Clases
{
    public class LogicaGasto : IGasto
    {
        private readonly DatosFinalDefinitivoContext context;

        public LogicaGasto(DatosFinalDefinitivoContext context)
        {
            this.context = context;
        }

        public List<Gasto> GetGastos()
        {
            return context.Gastos.ToList();
        }

        public List<Gasto> GetGastosByPersona(string personanombre)
        {
            return context.Gastos
                .Where(g => g.PersonaNombre == personanombre)
                .ToList();
        }

        public List<Gasto> GetGastosByPersonaYCategoria(string personanombre, string categorianombre)
        {
            return context.Gastos
                .Where(g => g.PersonaNombre == personanombre && g.CategoriaNombre == categorianombre)
                .ToList();
        }

        public void AddGasto(Gasto gasto)
        {
            if (gasto == null)
            {
                throw new ArgumentNullException(nameof(gasto));
            }

            // Check if the persona exists
            var existingPersona = context.Personas.FirstOrDefault(p => p.Usuario == gasto.PersonaNombre);
            if (existingPersona == null)
            {
                throw new InvalidOperationException("La persona especificada no existe.");
            }

            // Check if the category exists
            var existingCategoria = context.Categorias.FirstOrDefault(c => c.Nombre == gasto.CategoriaNombre);
            if (existingCategoria == null)
            {
                throw new InvalidOperationException("La categoría especificada no existe.");
            }

            // Add new gasto
            gasto.Id = 0; // Assuming Id should be set by the database
            context.Gastos.Add(gasto);
            context.SaveChanges();
        }



        public void UpdateGasto(Gasto gasto)
        {
            // Find the existing gasto by name and personanombre
            var existingGasto = context.Gastos.FirstOrDefault(g => g.Nombre == gasto.Nombre && g.PersonaNombre == gasto.PersonaNombre);

            if (existingGasto == null)
            {
                throw new InvalidOperationException("El gasto especificado no existe.");
            }

            // Check if the category exists
            var existingCategoria = context.Categorias.FirstOrDefault(c => c.Nombre == gasto.CategoriaNombre);
            if (existingCategoria == null)
            {
                throw new InvalidOperationException("La categoría especificada no existe para esta persona.");
            }

            // Update gasto properties
            existingGasto.Descripcion = gasto.Descripcion;
            existingGasto.Cantidad = gasto.Cantidad;
            existingGasto.CategoriaNombre = gasto.CategoriaNombre;

            // Save changes
            context.SaveChanges();
        }



        public void DeleteGasto(string nombre, string personanombre)
        {
            var gasto = context.Gastos
                .FirstOrDefault(g => g.Nombre == nombre && g.PersonaNombre == personanombre);

            if (gasto != null)
            {
                context.Gastos.Remove(gasto);
                context.SaveChanges();
            }
        }

    }
}
