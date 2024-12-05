export class Usuario{
    constructor(){}

    UsuarioId: string =""; // Se guarda un id unico para cada usuario registrado
    Usuario: string =""; //se guarda el username
    Nombre: string ="";  // Se guarda el nombre propio del usuario
    Correo: string =""; // Se guarda el correo del usuario
    Rol: string =""; // Se guarda el tipo de rol que va a tener el Usuario Ej: Profesor, Alumno, Administrador
    Contrasena: string =""; // Se guarda la contraseña del Usuario
    Carrera: string ="";//carrera del alumno
    Matricula="";


    setData(data:any){
        this.UsuarioId = data.UsuarioId;
        this.Nombre = data.Nombre;
        this.Correo = data.Correo;
        this.Rol = data.Rol;
        this.Contrasena = data.Contrasena;
        this.Carrera = data.Carrera
        this.Matricula = data.Matricula;
    }
}

export class Recurso{
    constructor(){}

    recursoId: string = ""; //Se guarda un id unico del recurso
    nombreRecurso: string = ""; // Se guarda el nombre del recurso
    descripcion: string = ""; // Se guarda un breve descripción del recurso
    tipoRecurso: string = ""; // Se guarda el tipo de recurso Ej: Insumo, Aula, Equipo
    //Supervision: boolean = false; // Se indica si el uso del recurso necesita supervisión
    Estado : string = ""; // Se guarda el estado del recurso que quiera utilizar Ej: Activo, Inactivo
    Ubicacion: string="";//El lugar fisico donde se encuenta el recurso o si es insumo en almacen
    Costo=""; //lo que le costo del producto a la institucion, en caso de que exista un daño saber cuanto cobrar
    cantidadReal=0; //cantidad que hay en el inventario realmente
    cantidadDisp=0; //la cantidad que hay disponible (puede disminuir cuando se solicita)
    cantidadSeleccionada=0; 
    //unidadMedida="";//por ejemplo si es un cable metros etc
    horarioDisp="";//horario ene l que esta disponible el recurso
    claveAdmin = "" //clave que el administrador asigna al recurso
    fotoRecurso=""; //foto del recurso
    Categoria="";

    setData(data:any){
        this.recursoId = data.recursoId;
        this.nombreRecurso = data.nombreRecurso;
        this.descripcion = data.descripcion;
        this.tipoRecurso = data.tipoRecurso;
        //this.Cantidad = data.Cantidad;
        //this.Supervision = data.Supervision;
        this.Estado = data.Estado;
        this.Ubicacion = data.Ubicacion;
        this.Costo = data.Costo;
        this.horarioDisp = data.horarioDisp;
        this.claveAdmin = data.claveAdmin;
        this.fotoRecurso = data.fotoRecurso;
        this.cantidadReal= data.cantidadReal;
        this.cantidadDisp = data.cantidadDisp;
        this.Categoria = data.Categoria;
        this.cantidadSeleccionada = data.cantidadSeleccionada;
    }
}

export class Solicitud {
    constructor(){this.recursos = []; }

    idSolicitud: string = ""; // Se guarda un id unico para cada solicitud
    usuarioId=""; //id del alumno que esta solicitando

    fechaSolicitud: string = ""; // Se guarda la fecha en la que se realiza la solicitud
    fechaSoliNumber: number = 0;

    fechaInicio: string = ""; // Se guarda la fecha para el uso de los recursos a utilizar
    fechaFin: string = ""; // Se guarda la fecha de fin para el uso de los recursos utilizados 
    estado: string = ""; // Se guarda el estado de la solicitud Ej: Pendiente, Aprobada, Rechazada
    idRecurso="";
    recursos : string []
    idRecursos = []
    cantidadRecursos= []
    profResponsable="";
    nombreSolicitante=""; //quien solicita el recurso
    carreraSolicitante =""
    motivo="";
    horarioInicio="";
    horarioFin="";
    diasPrestamo="";
    requiereSupervision="";
    matriculaSolic="";
    materia="";
   
  

    setData(data:any){
    this.idSolicitud = data.idSolicitud;
  
    this.fechaSolicitud = data.fechaSolicitud;
    this.fechaSoliNumber = data.fechaSoliNumber;
    this.fechaInicio = data.fechaUso;
    this.fechaFin = data.fechaFin;
    this.estado = data.estadoSolicitud;
    this.idRecurso = data.idRecurso;
    this.cantidadRecursos = data.cantidadRecursos;
    this.profResponsable = data.profResponsable;
    this.nombreSolicitante = data.solicitante;
    this.motivo = data.motivo;
    this.horarioInicio = data.horarioInicio;
    this.horarioFin = data.horarioFin;
    this.diasPrestamo = data.diasPrestamo;
    this.matriculaSolic= data.matriculaSolic
    this.materia =  data.materia
    this.recursos = data.recursos
    this.usuarioId = data.usuarioId;
    
    
    }
}


/*export class Reportes{
    reporteId: string = ""; // Se guarda un id unico para cada reporte
    Nombre: string= ""; // Se guarda el nombre de quien realizo el reporte
    descripcionReporte: string =""; // Se guardan los detalles del reporte, incluye el uso de recursos utilizado, aulas, equipos, etc
    fechaReporte: string =""; // Se guarda la fecha en la que se genero el reporte

    set(data:any){
        this.reporteId = data.reporteId;
        this.Nombre = data.Nombre;
        this.descripcionReporte = data.descripcionReporte;
        this. fechaReporte = data.fechaReporte;
    }
}*/
