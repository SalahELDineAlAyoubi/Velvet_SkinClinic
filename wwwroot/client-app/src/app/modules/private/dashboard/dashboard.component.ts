import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
 
interface Client {
  id: number;
  name: string;
  mobile: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private _searchTerm: string = '';
  constructor(private router: Router) { }

  get searchTerm(): string {
    return this._searchTerm;
  }

  set searchTerm(value: string) {
    this._searchTerm = value;
    this.page = 1; // reset page when search changes
  }

  clients: Client[] = [
    { id: 1, name: 'Lea Ahmad', mobile: '03111101' },
    { id: 2, name: 'Maysaa Ayoubi', mobile: '70123321' },
    { id: 3, name: 'Tala Dib', mobile: '81032659' },
    { id: 4, name: 'Alexandra Tayachi', mobile: '81032660' },
    { id: 5, name: 'Mira Mohammad', mobile: '81032661' },
    { id: 6, name: 'Hala Sayed', mobile: '81032662' },
    { id: 7, name: 'Arij Taha', mobile: '81032663' },
    { id: 8, name: 'Sana Ayoubi', mobile: '81032664' },
    { id: 9, name: 'Omar Khalil', mobile: '81032665' },
    { id: 10, name: 'Rana Majed', mobile: '81032666' },
    { id: 11, name: 'Nour Zaki', mobile: '81032667' },
    { id: 12, name: 'Samir Fadel', mobile: '81032668' },
    { id: 13, name: 'Lina Daher', mobile: '81032669' },
    { id: 14, name: 'Karim Nabil', mobile: '81032670' },
    { id: 15, name: 'Aya Fawzi', mobile: '81032671' },
    { id: 16, name: 'Youssef Amine', mobile: '81032672' },
    { id: 17, name: 'Maya Rami', mobile: '81032673' },
    { id: 18, name: 'Bilal Sami', mobile: '81032674' },
    { id: 19, name: 'Hana Taleb', mobile: '81032675' },
    { id: 20, name: 'Jad Saad', mobile: '81032676' },
    { id: 21, name: 'Rita Fadi', mobile: '81032677' },
    { id: 22, name: 'Tamer Nader', mobile: '81032678' },
    { id: 23, name: 'Sahar Tarek', mobile: '81032679' },
    { id: 24, name: 'Nadine Elias', mobile: '81032680' },
    { id: 25, name: 'Adel Rami', mobile: '81032681' },
    { id: 26, name: 'Salma Zain', mobile: '81032682' },
    { id: 27, name: 'Fadi Amir', mobile: '81032683' },
    { id: 28, name: 'Lamia Kamel', mobile: '81032684' },
    { id: 29, name: 'Oussama Rida', mobile: '81032685' },
    { id: 30, name: 'Mona Walid', mobile: '81032686' },
    { id: 31, name: 'Rayan Fouad', mobile: '81032687' },
    { id: 32, name: 'Nora Hani', mobile: '81032688' },
    { id: 33, name: 'Malak Sami', mobile: '81032689' },
    { id: 34, name: 'Ibrahim Ziad', mobile: '81032690' },
    { id: 35, name: 'Dina Jad', mobile: '81032691' },
    { id: 36, name: 'Hussein Fadi', mobile: '81032692' },
    { id: 37, name: 'Reem Tarek', mobile: '81032693' },
    { id: 38, name: 'Walid Nabil', mobile: '81032694' },
    { id: 39, name: 'Rima Samir', mobile: '81032695' },
    { id: 40, name: 'Firas Amine', mobile: '81032696' },
    { id: 41, name: 'Salim Taha', mobile: '81032697' },
    { id: 42, name: 'Lina Rami', mobile: '81032698' },
    { id: 43, name: 'Omar Hani', mobile: '81032699' },
    { id: 44, name: 'Maya Khalil', mobile: '81032700' },
    { id: 45, name: 'Yara Samir', mobile: '81032701' },
    { id: 46, name: 'Tamer Jad', mobile: '81032702' },
    { id: 47, name: 'Sana Walid', mobile: '81032703' },
    { id: 48, name: 'Jad Fadi', mobile: '81032704' },
    { id: 49, name: 'Nour Karim', mobile: '81032705' },
    { id: 50, name: 'Rita Rami', mobile: '81032706' },
    { id: 51, name: 'Bilal Tarek', mobile: '81032707' },
    { id: 52, name: 'Hana Amine', mobile: '81032708' },
    { id: 53, name: 'Adel Samir', mobile: '81032709' },
    { id: 54, name: 'Salma Jad', mobile: '81032710' },
    { id: 55, name: 'Fadi Walid', mobile: '81032711' },
    { id: 56, name: 'Lamia Rami', mobile: '81032712' },
    { id: 57, name: 'Oussama Taha', mobile: '81032713' },
    { id: 58, name: 'Mona Samir', mobile: '81032714' },
    { id: 59, name: 'Rayan Nabil', mobile: '81032715' },
    { id: 60, name: 'Nora Khalil', mobile: '81032716' },
    { id: 61, name: 'Malak Jad', mobile: '81032717' },
    { id: 62, name: 'Ibrahim Samir', mobile: '81032718' },
    { id: 63, name: 'Dina Rami', mobile: '81032719' },
    { id: 64, name: 'Hussein Tarek', mobile: '81032720' },
    { id: 65, name: 'Reem Fadi', mobile: '81032721' },
    { id: 66, name: 'Walid Jad', mobile: '81032722' },
    { id: 67, name: 'Rima Walid', mobile: '81032723' },
    { id: 68, name: 'Firas Samir', mobile: '81032724' },
    { id: 69, name: 'Salim Amine', mobile: '81032725' },
    { id: 70, name: 'Lina Fadi', mobile: '81032726' },
    { id: 71, name: 'Omar Samir', mobile: '81032727' },
    { id: 72, name: 'Maya Taha', mobile: '81032728' },
    { id: 73, name: 'Yara Khalil', mobile: '81032729' },
    { id: 74, name: 'Tamer Samir', mobile: '81032730' },
    { id: 75, name: 'Sana Fadi', mobile: '81032731' },
    { id: 76, name: 'Jad Amine', mobile: '81032732' },
    { id: 77, name: 'Nour Samir', mobile: '81032733' },
    { id: 78, name: 'Rita Taha', mobile: '81032734' },
    { id: 79, name: 'Bilal Rami', mobile: '81032735' },
    { id: 80, name: 'Hana Samir', mobile: '81032736' },
    { id: 81, name: 'Adel Khalil', mobile: '81032737' },
    { id: 82, name: 'Salma Samir', mobile: '81032738' },
    { id: 83, name: 'Fadi Rami', mobile: '81032739' },
    { id: 84, name: 'Lamia Samir', mobile: '81032740' },
    { id: 85, name: 'Oussama Khalil', mobile: '81032741' },
    { id: 86, name: 'Mona Taha', mobile: '81032742' },
    { id: 87, name: 'Rayan Samir', mobile: '81032743' },
    { id: 88, name: 'Nora Rami', mobile: '81032744' },
    { id: 89, name: 'Malak Samir', mobile: '81032745' },
    { id: 90, name: 'Ibrahim Khalil', mobile: '81032746' },
    { id: 91, name: 'Dina Taha', mobile: '81032747' },
    { id: 92, name: 'Hussein Samir', mobile: '81032748' },
    { id: 93, name: 'Reem Khalil', mobile: '81032749' },
    { id: 94, name: 'Walid Samir', mobile: '81032750' },
    { id: 95, name: 'Rima Amine', mobile: '81032751' },
    { id: 96, name: 'Firas Rami', mobile: '81032752' },
    { id: 97, name: 'Salim Samir', mobile: '81032753' },
    { id: 98, name: 'Lina Khalil', mobile: '81032754' },
    { id: 99, name: 'Omar Taha', mobile: '81032755' },
    { id: 100, name: 'Maya Samir', mobile: '81032756' }
  ];

  page: number = 1;
  pageSize: number = 10;

  get paginatedClients(): Client[] {
    if (this.page > this.totalPages) this.page = this.totalPages || 1;
    const start = (this.page - 1) * this.pageSize;
    return this.filteredClients.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredClients.length / this.pageSize);
  }

  nextPage() {
    if (this.page < this.totalPages) this.page++;
  }

  prevPage() {
    if (this.page > 1) this.page--;
  }
  goToClient(id: string | number) {
    this.router.navigate(['/clients', id]);
  }
  get filteredClients(): Client[] {
    if (!this.searchTerm) return this.clients;
    return this.clients.filter(c =>
      c.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.mobile.includes(this.searchTerm) ||
      c.id.toString().includes(this.searchTerm)
    );
  }
}
