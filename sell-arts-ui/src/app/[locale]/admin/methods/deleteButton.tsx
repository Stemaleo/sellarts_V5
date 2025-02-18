import { useRouter } from "next/navigation";
import axios from "axios";
import { AlertDialogAction } from "@/components/ui/alert-dialog";
import { DELETE_METHOD } from "@/actions/mutation/admin/methodsType/deleteMutation";


const DeleteButton = ({ methodId }: { methodId: number }) => {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
        query: DELETE_METHOD,
        variables: {
          methods: [methodId],
          detete: true, 
        },
      });

      const { data } = response;
      
      if (data.errors) {
        console.error("Erreur de suppression:", data.errors);
        return;
      }

      // Vérifiez si la suppression a été effectuée avec succès
      const success = data?.data?.featureUpdateMethodDeletions?.success;
      if (success) {
        router.refresh();
      }
    } catch (error) {
      console.error("Erreur lors de l'appel à la mutation:", error);
    }
  };

  return (
    <AlertDialogAction onClick={handleDelete}>
      Continue
    </AlertDialogAction>
  );
};

export default DeleteButton;
