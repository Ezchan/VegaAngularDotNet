using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vega.Controllers.Resources;
using vega.Core;
using vega.Core.Models;
using vega.Persistence;

namespace vega.Controllers
{
  [Route("/api/vehicles")]
  public class VehiclesController : Controller
  {
    private readonly IMapper mapper;
    private readonly IVehicleRepository repository;
    private readonly IUnitOfWork unitOfWork;
    public VehiclesController(IMapper mapper, IVehicleRepository repository, IUnitOfWork unitOfWork)
    {
      this.unitOfWork = unitOfWork;
      this.repository = repository;
      this.mapper = mapper;

    }

    [HttpPost]
    public async Task<IActionResult> CreateVehicle([FromBody] SaveVehicleResource vehicleResource)
    {
      throw new Exception();
      
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      // var model = await context.Models.FindAsync(vehicleResource.ModelId);
      // if (model == null){
      //   ModelState.AddModelError("ModelId", "Invalid ModelId.");
      //   return BadRequest(ModelState);
      // }
      // if (true) {
      //   ModelState.AddModelError("...", "...");
      // }
      // Map to vehicle
      Vehicle vehicle = mapper.Map<SaveVehicleResource, Vehicle>(vehicleResource);

      vehicle.LastUpdate = DateTime.Now;
      repository.Add(vehicle);
      await unitOfWork.CompleteAsync();

      vehicle = await repository.GetVehicle(vehicle.Id);

      //Map back to resource to return
      var result = mapper.Map<Vehicle, VehicleResource>(vehicle);
      return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVehicle(int id, [FromBody] SaveVehicleResource vehicleResource)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      // var model = await context.Models.FindAsync(vehicleResource.ModelId);
      // if (model == null){
      //   ModelState.AddModelError("ModelId", "Invalid ModelId.");
      //   return BadRequest(ModelState);
      // }
      // if (true) {
      //   ModelState.AddModelError("...", "...");
      // }
      // Map to vehicle
      var vehicle = await repository.GetVehicle(id);


      if (vehicle == null)
      {
        return NotFound();
      }

      mapper.Map<SaveVehicleResource, Vehicle>(vehicleResource, vehicle);
      vehicle.LastUpdate = DateTime.Now;
      await unitOfWork.CompleteAsync();

      vehicle = await repository.GetVehicle(vehicle.Id);
      //Map back to resource to return
      var result = mapper.Map<Vehicle, VehicleResource>(vehicle);
      return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVehicle(int id)
    {
      var vehicle = await repository.GetVehicle(id, includeRelated: false);

      if (vehicle == null)
      {
        return NotFound();
      }
      repository.Remove(vehicle);
      await unitOfWork.CompleteAsync();
      return Ok(id);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetVehicle(int id)
    {
      var vehicle = await repository.GetVehicle(id);

      if (vehicle == null)
      {
        return NotFound();
      }
      var vehicleResoure = mapper.Map<Vehicle, VehicleResource>(vehicle);
      return Ok(vehicleResoure);
    }

    [HttpGet]
    public async Task<QueryResultResource<VehicleResource>> GetVehicles(VehicleQueryResource filterResource){
      var filter = mapper.Map<VehicleQueryResource, VehicleQuery>(filterResource);
      var queryResult = await repository.GetVehicles(filter);
      return mapper.Map<QueryResult<Vehicle>, QueryResultResource<VehicleResource>>(queryResult);
    }
  }
}