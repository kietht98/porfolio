import "reflect-metadata";
import { Container, injectable, inject } from "inversify";

// Định nghĩa các interface
interface Weapon {
  use(): string;
}

interface Warrior {
  fight(): string;
}

// Tạo class implement các interface
@injectable()
class Katana implements Weapon {
  use() {
    return "swinging a katana!";
  }
}

@injectable()
class Ninja implements Warrior {
  private weapon: Weapon;

  constructor(@inject("Weapon") weapon: Weapon) {
    this.weapon = weapon;
  }

  fight() {
    return this.weapon.use();
  }
}

// Khởi tạo IoC container
const container = new Container();

// Bind các interface với implementation
container.bind<Weapon>("Weapon").to(Katana);
container.bind<Warrior>("Warrior").to(Ninja);

// Lấy đối tượng từ container và sử dụng
const ninja = container.get<Weapon>("Weapon");
console.log(ninja.use()); // Output: "swinging a katana!"
