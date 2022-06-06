import { Navigate, NavigationType, Params, useNavigate, useParams } from "react-router-dom";
import {database} from '../services/firebase'

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg"
import checkImg from "../assets/images/check.svg"
import answerImg from "../assets/images/answer.svg"

import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";

/* import { useAuth } from "../hooks/useAuth"; */

import "../styles/room.scss";
import "../styles/question.scss";
import { useRoom } from "../hooks/useRoom";
import { useState } from "react";

export function AdminRoom() {
  /* const { user } = useAuth(); */
  const { id } = useParams() as {
    id: string;
  };
  const roomId = id;
  const [newQuestion, setNewQuestion] = useState("");
  const navigate = useNavigate()
  const { questions, title } = useRoom(roomId);

  async function handleEndRoom(){
    if(window.confirm("Tem certeza que deseja deletar a sala?")){
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date(),
      })
      navigate('/')
    }
    
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }


  async function handleHighlighQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    })
  }

  async function handleDeleteQuestion(questionId: string) {
    if(window.confirm('Tem certeza que deseja excluir essa pergunta?')){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={id} />
            <Button isOutlined onClick={handleEndRoom}> 
              Encerrar sala
              </Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala React</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}

              >
                {!question.isAnswered && (
                  <>
                <button
                type="button"
                onClick={() => handleCheckQuestionAsAnswered(question.id)}
                >
                  <img src={checkImg} alt="Marcar como respondido" />
                </button>
               
                <button
                type="button"
                onClick={() => handleHighlighQuestion(question.id)}
                >
                  <img src={answerImg} alt="Destaque da pergunta" />
                </button>
                </>
                )}
                <button
                type="button"
                onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
                
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}

//Algoritmo de reconciliação
