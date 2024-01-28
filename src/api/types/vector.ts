class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  // Método para adicionar dois vetores
  add(other: Vector3): Vector3 {
    return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  // Método para subtrair dois vetores
  sub(other: Vector3): Vector3 {
    return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  // Método para multiplicar o vetor por um escalar
  mul(scalar: number): Vector3 {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  // Método para dividir o vetor por um escalar
  div(scalar: number): Vector3 {
    if (scalar !== 0) {
      return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
    } else {
      throw new Error("Divisão por zero não é permitida.");
    }
  }

  // Método para calcular a distância entre dois vetores
  distanceTo(other: Vector3): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const dz = this.z - other.z;
    return (dx * dx + dy * dy + dz * dz) ** 0.5;
  }

  // Método para normalizar o vetor (torná-lo unitário)
  normalize(): Vector3 {
    const length = (this.x * this.x + this.y * this.y + this.z * this.z) ** 0.5;
    if (length !== 0) {
      return this.div(length);
    } else {
      throw new Error("Não é possível normalizar um vetor nulo.");
    }
  }

  // Método para realizar uma interpolação linear entre dois vetores
  lerp(target: Vector3, alpha: number): Vector3 {
    const beta = 1 - alpha;
    const x = this.x * beta + target.x * alpha;
    const y = this.y * beta + target.y * alpha;
    const z = this.z * beta + target.z * alpha;
    return new Vector3(x, y, z);
  }

  rotationToDirection(): Vector3 {
    // Converte os ângulos de inclinação, orientação e rotação para radianos
    const pitch = (this.x * Math.PI) / 180;
    const yaw = (this.y * Math.PI) / 180;
    // const roll = (this.z * Math.PI) / 180;

    // Calcula a direção usando coordenadas esféricas
    const x = Math.cos(yaw) * Math.cos(pitch);
    const y = Math.sin(yaw) * Math.cos(pitch);
    const z = Math.sin(pitch);

    return new Vector3(x, y, z);
  }

  directionTo(target: Vector3): Vector3 {
    const difference = target.sub(this);
    return difference.normalize();
  }
}


export { Vector3 }