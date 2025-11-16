import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

// 1. Quitamos 'onClose' de los props, usaremos 'onOpenChange' que es más completo.
// 2. Añadimos 'isOpen' y 'onOpenChange' que vendrán del padre.
export default function ModalCalendario({ modalInfo, isOpen, onOpenChange }) {
  
  // 3. ¡IMPORTANTE! Quitamos el useDisclosure() de aquí.
  // 4. Quitamos el <Button onPress={onOpen}> de aquí. El padre lo controlará.

  return (
    // 5. Usamos los props recibidos para controlar el Modal
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => ( // Este 'onClose' es provisto por NextUI para cerrar el modal
          <>
            {/* 6. Usamos la info del prop 'modalInfo' */}
            <ModalHeader className="flex flex-col gap-1">
              {/* Usamos '?' para evitar errores si modalInfo es null al inicio */}
              {modalInfo?.title || "Detalle"}
            </ModalHeader>
            <ModalBody>
              <p>
                {modalInfo?.description || "No hay información para mostrar."}
              </p>
              {/* Aquí puedes mostrar más datos de modalInfo */}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cerrar
              </Button>
              <Button color="primary" onPress={onClose}>
                Acción
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}