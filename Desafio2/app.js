import express, { Request, Response } from "express";
import bodyParser from 'body-parser';
import axios from "axios";

const app = express();

const porta: number = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rota simples para raiz
app.get('/', (req: Request, res: Response) => {
    res.send('Bem vindo ao meu servidor!');
  });

// inicializa o servidor
app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
    console.log(`Rota para listar todos os usuários: http://localhost:${porta}/users`);
    console.log(`Rota para obter detalhes de um usuário pelo ID: http://localhost:${porta}/users/{userId}`);
    console.log(`Rota para adicionar um novo usuário: http://localhost:${porta}/users (método POST)`);
    console.log(`Rota para saudação personalizada ao usuário: http://localhost:${porta}/users/greet/{firstName}`);
    console.log(`Rota para editar um usuário pelo ID: http://localhost:${porta}/users/{userId} (método PUT)`);
    console.log(`Rota para deletar um usuário pelo id: http://localhost:${porta}/users/{userId} (método DELETE)`);
  });

  // Lista de usuários
const users = [
    { userId: 1, firstName: "Adriano", lastName: "Baza" },
    { userId: 2, firstName: "Ana", lastName: "Catarina" },
    { userId: 3, firstName: "Vitor", lastName: "Ferreira  " },
];

// Rota para listar todos os usuários
app.get('/users', (req: Request, res: Response) => {
// Lógica para obter e retornar todos os usuários
    res.status(200).json({ users });
});

// Rota para obter detalhes de um usuário pelo ID
app.get("/users/:userId", (req: Request, res: Response) => {
    const user = users.find((l) => l.userId === parseInt(req.params.userId));  
    if (!user) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }
    res.status(200).json({usuario: `${user.userId} - ${user.firstName} ${user.lastName} - consulta concluída com sucesso`});
});

// Função para obter o próximo userId
const getNextUserId = () => {
    const maxUserId = users.reduce((max, user) => (user.userId > max ? user.userId : max), 0);
    return maxUserId + 1;
};

// Rota para adicionar um novo usuário
app.post("/users", (req: Request, res: Response) => {
    const existingUser = users.find(user => 
        user.firstName === req.body.firstName && user.lastName === req.body.lastName
    );

    if (existingUser) {
        return res.status(400).json({ mensagem: "Operação não realizada. Usuário já está cadastrado" });
    }

    const newUser = {
        userId: getNextUserId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    };

    users.push(newUser);
    res.status(201).json({ mensagem: `${newUser.userId} - ${newUser.firstName} - ${newUser.lastName} - usuário cadastrado com sucesso` });
});

// Rota para saudação personalizada ao usuário com entrada do parâmetro nome
app.get("/users/greet/:firstName", (req: Request, res: Response) => {
    const user = users.find((l) => l.firstName === (req.params.firstName));  
    for (let i: number = 0; i <= users.length; i++) {
        if (user) {
            res.status(200).json({ Saudação: `Olá, ${user.firstName}! Bem-vindo ao nosso serviço.` });
        };
        return res.status(404).json({ mensagem: "Usuário não encontrado" });
    };
});

//Rota para editar um usuário pelo id
app.put("/users/:userId", (req: Request, res: Response) => {
    const userIndex = users.findIndex((l) => l.userId === parseInt(req.params.userId));
  
    if (userIndex === -1) {
      return res.status(404).json({ mensagem: "Operação não realizada. Usuário não encontrado" });
    }
    users[userIndex] = {
      userId: users[userIndex].userId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };
    res.status(201).json({ mensagem: `${users[userIndex].userId} - ${users[userIndex].firstName} - ${users[userIndex].lastName} - cadastro atualizado com sucesso`});
  });

// Rota para deletar um usuário pelo id
app.delete("/users/:userId", (req: Request, res: Response) => {
    const userIdToDelete = parseInt(req.params.userId);
    
    const userIndex = users.findIndex((user) => user.userId === userIdToDelete);

    if (userIndex === -1) {
        return res.status(404).json({ mensagem: "Operação não realizada. Usuário não encontrado" });
    }

    const deletedUser = users.splice(userIndex, 1)[0]; // Remova e capture o usuário removido

    res.json({ mensagem: `${deletedUser.userId} - ${deletedUser.firstName} - ${deletedUser.lastName} - Usuário removido com sucesso` });
});