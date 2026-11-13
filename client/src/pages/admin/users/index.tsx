import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { userType } from "../../../../../server/src/types/user";

import { Button, ButtonGroup, Modal, ModalContent, ModalTitle, TextInput, Title } from "@dataesr/dsfr-plus";

export default function AdminUsers() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userForm, setUserForm] = useState({ firstName: "", lastName: "", email: "" });
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery<userType[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        throw new Error("Impossible de charger les utilisateurs.");
      }
      return response.json();
    },
  });

  const addUser = useMutation({
    mutationFn: async (user: typeof userForm) => {
      const response = await fetch("/api/admin/users", {
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Impossible d'ajouter l'utilisateur.");
      }
      return response.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      setUserForm({ firstName: "", lastName: "", email: "" });
      setIsOpen(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addUser.mutate(userForm);
  };

  return (
    <>
      <Modal isOpen={isOpen} hide={() => setIsOpen(false)}>
        <ModalTitle>Ajout d'un utilisateur</ModalTitle>
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <TextInput label="Prénom" value={userForm.firstName} onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })} required />
            <TextInput label="Nom" value={userForm.lastName} onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })} required />
            <TextInput label="Email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} type="email" required />
            {addUser.isError && <p role="alert">{addUser.error.message}</p>}
            <ButtonGroup isInlineFrom="xs" align="right">
              <Button type="submit" disabled={addUser.isPending}>
                Ajouter
              </Button>
            </ButtonGroup>
          </form>
        </ModalContent>
      </Modal>
      <Title className="fr-my-3w">Utilisateurs</Title>
      <Button
        className="fr-mb-2w"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
      >
        Nouvel utilisateur
      </Button>
      <table className="fr-table">
        <thead>
          <tr>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
          </tr>
        </thead>
        <tbody>
          {isError && (
            <tr>
              <td role="alert">Impossible de charger les utilisateurs.</td>
            </tr>
          )}
          {isLoading && (
            <tr>
              <td>Loading...</td>
            </tr>
          )}
          {!isLoading &&
            users &&
            users.length > 0 &&
            users.map((user: userType) => (
              <tr key={user._id}>
                <td>{user?.firstName}</td>
                <td>{user?.lastName}</td>
                <td>{user?.email}</td>
                <td>{user?.role}</td>
              </tr>
            ))}
          {!isLoading && users?.length === 0 && (
            <tr>
              <td>No users</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
