using CapaDatos;
using GastosAPI.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace GastosAPI.Clases
{
	public class LogicaCategoria : ICategoria
	{
		private DatosFinalDefinitivoContext context;
	   
		public LogicaCategoria(DatosFinalDefinitivoContext context)
		{
			this.context = context;
		}

		public List<Categoria> GetCategorias()
		{
			return context.Categorias.ToList();
		}

  
        public List<Categoria> GetCategoriaByPersona(string personanombre)
        {
            return context.Categorias
                .Where(c => c.PersonaNombre == personanombre)
                .ToList();
        }

        public Categoria GetCategoriaByNameAndPersona(string categorianombre, string personanombre)
        {
            return context.Categorias.FirstOrDefault(c => c.Nombre == categorianombre && c.PersonaNombre == personanombre);
        }

        public void AddCategoria(Categoria categoria)
		{
			if (categoria == null)
			{
				throw new ArgumentNullException(nameof(categoria));
			}

			var existingPersona = context.Personas.FirstOrDefault(p => p.Usuario == categoria.PersonaNombre);
			if (existingPersona == null)
			{
				throw new InvalidOperationException("La persona especificada no existe.");
				
			} 

			categoria.Id = 0;

			context.Categorias.Add(categoria);
			context.SaveChanges();
		}

        public void UpdateCategoria(Categoria categoria)
        {
            var existingCategoria = context.Categorias
                .FirstOrDefault(c => c.Nombre == categoria.Nombre && c.PersonaNombre == categoria.PersonaNombre);

            if (existingCategoria != null)
            {
                var existingPersona = context.Personas.FirstOrDefault(p => p.Usuario == categoria.PersonaNombre);
                if (existingPersona == null)
                {
                    throw new InvalidOperationException("La persona especificada no existe.");

                }

                existingCategoria.Descripcion = categoria.Descripcion;
                existingCategoria.MontoLimite = categoria.MontoLimite;

                context.SaveChanges();
            }
        }


        public void DeleteCategoria(string nombre, string personanombre)
        {
            var categoria = context.Categorias
                                .FirstOrDefault(c => c.Nombre == nombre && c.PersonaNombre == personanombre);

            if (categoria != null)
            {
                context.Categorias.Remove(categoria);
                context.SaveChanges();
            }
        }

    }
}
